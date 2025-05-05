import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class DataFetcherService {
  private readonly logger = new Logger(DataFetcherService.name);

  constructor() {
    this.logger.log("DataFetcherService initialized");
  }

  /**
   * Fetches JSON data from a specified URL
   * @param url The URL to fetch data from
   * @returns The fetched data or null if an error occurred
   */
  async fetchJsonData<T>(url: string): Promise<T | null> {
    try {
      this.logger.log(`Fetching data from: ${url}`);
      const response = await axios.get<T>(url);
      this.logger.log(`Successfully fetched data from: ${url}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch data from ${url}`, error);
      return null;
    }
  }

  /**
   * Fetches JSON data from multiple URLs
   * @param urls List of URLs to fetch data from
   * @returns Object with URL keys and corresponding data
   */
  async fetchMultipleJsonData<T>(
    urls: string[],
  ): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {};

    // Use Promise.all for parallel fetching
    const promises = urls.map(async (url) => {
      result[url] = await this.fetchJsonData<T>(url);
    });

    await Promise.all(promises);
    return result;
  }

  /**
   * Posts data to a specified URL
   * @param url The URL to post data to
   * @param data The data to post
   * @returns The response data or null if an error occurred
   */
  async postJsonData<T, R>(url: string, data: T): Promise<R | null> {
    try {
      this.logger.log(`Posting data to: ${url}`);
      const response = await axios.post<R>(url, data);
      this.logger.log(`Successfully posted data to: ${url}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to post data to ${url}`, error);
      return null;
    }
  }
}
