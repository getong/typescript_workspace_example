import { Injectable, Logger, OnModuleInit, Inject } from "@nestjs/common";
import { Cron, Interval, Timeout } from "@nestjs/schedule";
import { DataFetcherService } from "./data-fetcher.service";

// Define interface for product data
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  thumbnail: string;
}

// Define interface for user data
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

// Define interface for products response
interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Define interface for users response
interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly logger = new Logger(TasksService.name);
  private cachedData: Record<string, any> = {};

  constructor(
    @Inject(DataFetcherService) private dataFetcherService: DataFetcherService,
  ) {
    this.logger.log("TasksService constructor called");
  }

  onModuleInit() {
    this.logger.log("TasksService initialized");
    if (!this.dataFetcherService) {
      this.logger.error("DataFetcherService not available in onModuleInit!");
    } else {
      this.logger.log("DataFetcherService successfully injected");
    }
  }

  @Cron("0 */30 * * * *") // Run every 30 minutes
  async fetchProductsUpdate() {
    try {
      this.logger.log("Fetching products data...");

      if (!this.dataFetcherService) {
        this.logger.error(
          "DataFetcherService not available in fetchProductsUpdate!",
        );
        return;
      }

      const apiUrl = "https://dummyjson.com/products";
      const data =
        await this.dataFetcherService.fetchJsonData<ProductsResponse>(apiUrl);

      if (data) {
        this.cachedData.products = data;
        this.logger.log(
          `Products update: ${data.total} total products, fetched ${data.products.length}`,
        );

        // Log first product details
        if (data.products.length > 0) {
          const firstProduct = data.products[0];
          this.logger.log(
            `Sample product: ${firstProduct.title} - $${firstProduct.price} (${firstProduct.brand})`,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Error in fetchProductsUpdate: ${error.message}`);
    }
  }

  @Interval(60000) // Run every minute
  async fetchQuickUpdates() {
    try {
      this.logger.log("Fetching quick updates...");

      if (!this.dataFetcherService) {
        this.logger.error(
          "DataFetcherService not available in fetchQuickUpdates!",
        );
        return;
      }

      const endpoints = [
        "https://dummyjson.com/users?limit=5",
        "https://dummyjson.com/products/categories",
      ];

      const results =
        await this.dataFetcherService.fetchMultipleJsonData<any>(endpoints);

      for (const [url, data] of Object.entries(results)) {
        if (data) {
          const endpointName = url.includes("users") ? "users" : "categories";
          this.cachedData[endpointName] = data;

          if (endpointName === "users" && data.users) {
            this.logger.log(
              `Updated users data: fetched ${data.users.length} users`,
            );
          } else if (endpointName === "categories" && Array.isArray(data)) {
            this.logger.log(
              `Updated categories data: fetched ${data.length} categories`,
            );
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error in fetchQuickUpdates: ${error.message}`);
    }
  }

  @Timeout(5000) // Run once after 5 seconds on startup
  async initialDataLoad() {
    try {
      this.logger.log("Performing initial data load...");
      await this.fetchProductsUpdate();
      await this.fetchQuickUpdates();
      this.logger.log("Initial data load completed");
    } catch (error) {
      this.logger.error("Error in initialDataLoad", error);
    }
  }

  // Method to manually trigger a data fetch
  async fetchDataFromUrl(url: string): Promise<any> {
    try {
      this.logger.log(`Manually fetching data from ${url}`);
      if (!this.dataFetcherService) {
        throw new Error("DataFetcherService is not available");
      }

      const data = await this.dataFetcherService.fetchJsonData<any>(url);

      if (data) {
        const urlKey = url.replace(/^https?:\/\//, "").replace(/[^\w]/g, "_");
        this.cachedData[urlKey] = data;
      }

      return data;
    } catch (error) {
      this.logger.error(`Error fetching data from ${url}`, error);
      return null;
    }
  }

  // Method to get cached data
  getCachedData(key?: string): any {
    if (key) {
      return this.cachedData[key] || null;
    }
    return this.cachedData;
  }
}
