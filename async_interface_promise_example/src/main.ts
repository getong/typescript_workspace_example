/**
 * Example demonstrating TypeScript interfaces with async functions and promises
 */

// Define error types for better error handling
enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  PARSING = 'PARSING_ERROR',
  VALIDATION = 'VALIDATION_ERROR'
}

// Custom error class with type information
class ServiceError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

// Define response status for the service
type ResponseStatus = 'success' | 'error' | 'pending';

// Generic response wrapper type
interface ServiceResponse<T> {
  status: ResponseStatus;
  data?: T;
  error?: ServiceError;
  timestamp: Date;
}

// Interface defining async methods returning promises
interface DataService {
  // Method returning a Promise of string
  fetchData(): Promise<string>;

  // Method with parameter returning a Promise of generic type
  processData<T>(data: string): Promise<ServiceResponse<T>>;

  // Method that handles errors via Promise
  validateData<T extends Record<string, any>>(data: T, requiredFields: Array<keyof T>): Promise<boolean>;
}

// Implementation of the DataService interface
class APIDataService implements DataService {
  /**
   * Simulates fetching data asynchronously
   * @returns Promise resolving with fetched data
   */
  async fetchData(): Promise<string> {
    // Simulating API call with setTimeout but with much lower failure rate (5%)
    return new Promise<string>((resolve: (value: string) => void, reject: (reason: ServiceError) => void) => {
      setTimeout(() => {
        if (Math.random() > 0.05) { // Reduced failure rate from 0.2 to 0.05
          resolve('{"id": 1, "name": "Sample Data", "active": true, "score": 95}');
        } else {
          reject(new ServiceError(
            ErrorType.NETWORK, 
            "Failed to fetch data from server", 
            503
          ));
        }
      }, 1000);
    });
  }

  /**
   * Processes string data into specified type
   * @param data String data to process
   * @returns Promise with processed data wrapped in ServiceResponse
   */
  async processData<T>(data: string): Promise<ServiceResponse<T>> {
    try {
      // Parse the JSON string into an object
      const parsed = JSON.parse(data) as T;
      
      // Explicitly typed return object
      const response: ServiceResponse<T> = {
        status: 'success',
        data: parsed,
        timestamp: new Date()
      };
      
      return response;
    } catch (error) {
      const serviceError = new ServiceError(
        ErrorType.PARSING,
        `Processing error: ${error.message}`,
      );
      
      // Explicitly typed error response
      const errorResponse: ServiceResponse<T> = {
        status: 'error',
        error: serviceError,
        timestamp: new Date()
      };
      
      return errorResponse;
    }
  }

  /**
   * Validates data structure against required fields
   * @param data Data object to validate
   * @param requiredFields Array of field names that must exist in data
   * @returns Promise resolving to boolean indicating validity
   */
  async validateData<T extends Record<string, any>>(
    data: T, 
    requiredFields: Array<keyof T>
  ): Promise<boolean> {
    return new Promise<boolean>((resolve: (value: boolean) => void) => {
      // Check if all required fields exist in the data object
      const isValid = requiredFields.every(field => 
        field in data && data[field] !== undefined && data[field] !== null
      );
      
      resolve(isValid);
    });
  }
  
  /**
   * Example of a more complex promise with multiple resolve/reject types
   * @param id The ID to look up
   * @returns Promise that may resolve with different data types based on conditions
   */
  fetchDetailedData(id: number): Promise<UserData | string | number> {
    return new Promise<UserData | string | number>(
      (
        resolve: (value: UserData | string | number) => void, 
        reject: (reason: ServiceError | Error) => void
      ) => {
        setTimeout(() => {
          const random = Math.random();
          
          // Adjusted probability to favor successful outcomes
          if (random > 0.3) { // 70% chance of user data
            // Resolve with user data object
            const userData: UserData = {
              id,
              name: "Advanced Example",
              active: true,
              score: 100
            };
            resolve(userData);
          } else if (random > 0.15) { // 15% chance of string
            // Resolve with string
            resolve(`ID ${id} found but data format is limited`);
          } else if (random > 0.05) { // 10% chance of number
            // Resolve with just the number
            resolve(id);
          } else { // Only 5% chance of error
            // Reject with typed error
            if (random > 0.02) {
              reject(new ServiceError(
                ErrorType.NETWORK,
                `Failed to fetch data for ID ${id}`,
                404
              ));
            } else {
              reject(new Error("Generic error occurred"));
            }
          }
        }, 800);
      }
    );
  }
}

// Strongly typed user data interface
interface UserData {
  id: number;
  name: string;
  active: boolean;
  score: number;
  lastLogin?: Date;
}

// Type for validation configurations
type ValidationConfig<T> = {
  entity: string;
  requiredFields: Array<keyof T>;
}

/**
 * Main async function demonstrating the usage
 */
async function runExample(): Promise<void> {
  console.log("Starting async interface example...");

  const service: DataService = new APIDataService();
  
  // Define validation configuration
  const userValidation: ValidationConfig<UserData> = {
    entity: 'user',
    requiredFields: ['id', 'name', 'active']
  };

  // Add retry logic for more reliable demonstration
  async function fetchWithRetry<T>(
    operation: () => Promise<T>, 
    retries: number = 3
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries <= 0) throw error;
      
      console.log(`Retrying operation... (${retries} attempts left)`);
      return fetchWithRetry(operation, retries - 1);
    }
  }

  try {
    // Using retry logic to ensure demonstration works
    const rawData: string = await fetchWithRetry(() => service.fetchData());
    console.log("Raw data fetched:", rawData);

    // Using generics with the interface's Promise-based method
    const response: ServiceResponse<UserData> = await service.processData<UserData>(rawData);
    
    if (response.status === 'error' || !response.data) {
      throw response.error || new Error("Unknown error occurred");
    }
    
    const processedData: UserData = response.data;
    console.log("Processed data:", processedData);

    // Validating the data with required fields
    const isValid: boolean = await service.validateData(
      processedData,
      userValidation.requiredFields
    );
    console.log("Data is valid:", isValid);

    // Promise chaining example with type assertions
    service
      .fetchData()
      .then((data: string) => service.processData<UserData>(data))
      .then((response: ServiceResponse<UserData>) => {
        if (response.status === 'success' && response.data) {
          console.log("Chained result:", response.data.name);
          return response.data;
        }
        throw response.error;
      })
      .catch((error: ServiceError | Error) => {
        const errorMsg = error instanceof ServiceError 
          ? `${error.type}: ${error.message}` 
          : error.message;
        console.error("Chain error:", errorMsg);
      });

    // Add a sequential demonstration to show all possible outcomes
    console.log("\n--- Sequential Demonstration of Different Return Types ---");
    
    // Demonstrate object return (UserData)
    try {
      const mockedUserData: UserData = {
        id: 456,
        name: "Guaranteed User Example",
        active: true,
        score: 88
      };
      
      console.log("1. Object return type example:");
      console.log("   Detailed user data:", mockedUserData.name);
    } catch (error) {
      console.error("   This should not fail");
    }
    
    // Demonstrate string return
    try {
      const stringResult = "ID 456 found but data format is limited";
      console.log("\n2. String return type example:");
      console.log("   String result:", stringResult);
    } catch (error) {
      console.error("   This should not fail");
    }
    
    // Demonstrate number return
    try {
      const numberResult = 456;
      console.log("\n3. Number return type example:");  
      console.log("   ID only:", numberResult);
    } catch (error) {
      console.error("   This should not fail");
    }
    
    // Demonstrate error handling
    try {
      console.log("\n4. Error handling example:");
      throw new ServiceError(
        ErrorType.NETWORK,
        "Demonstration of error handling",
        404
      );
    } catch (detailError) {
      if (detailError instanceof ServiceError) {
        console.error(`   Detailed error: ${detailError.type} - ${detailError.message}`);
      } else {
        console.error("   Unknown error:", detailError);
      }
    }

    // Try the actual method with better odds
    console.log("\n--- Actual Method Call (With Random Outcome) ---");
    if (service instanceof APIDataService) {
      try {
        // Use retry to increase chances of success
        const detailedResult = await fetchWithRetry(() => service.fetchDetailedData(123));
        
        // Type narrowing with type guards
        if (typeof detailedResult === 'object') {
          console.log("Detailed user data:", detailedResult.name);
        } else if (typeof detailedResult === 'string') {
          console.log("String result:", detailedResult);
        } else if (typeof detailedResult === 'number') {
          console.log("ID only:", detailedResult);
        }
      } catch (detailError) {
        if (detailError instanceof ServiceError) {
          console.error(`Detailed fetch error: ${detailError.type} - ${detailError.message}`);
        } else {
          console.error("Unknown error:", detailError);
        }
      }
    }
    
  } catch (error) {
    const errorMsg = error instanceof ServiceError 
      ? `${error.type}: ${error.message}` 
      : error.message;
    console.error("Error in async operations:", errorMsg);
    
    // Show fallback demo even if main operation failed
    console.log("\n--- Fallback Demonstration (Since Main Flow Failed) ---");
    console.log("This ensures you see all example types regardless of random failures");
    
    // Create sample data to show functionality
    const sampleData: UserData = {
      id: 999,
      name: "Fallback Example",
      active: true,
      score: 75
    };
    
    console.log("Sample user data:", sampleData);
    console.log("Validation example:", 
      await service.validateData(sampleData, ['id', 'name', 'active'])
    );
  }
}

// Define function with proper return type
function logCompletion(): void {
  console.log("Example completed");
}

// Run the example
runExample().then(logCompletion);
