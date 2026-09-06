import {
  MonobankClientInfo,
  MonobankStatementParameters,
  MonobankTransaction,
} from "@server/integrations/monobank/monobank.types.js";
import {
  AppError,
  ValidationError,
  AuthError,
} from "@server/errors/AppErrors.js";

export class MonobankClient {
  private readonly baseURL = "https://api.monobank.ua/personal";

  private async getApiResponse(userToken: string, requestUrl: string) {
    const response: Response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Token": userToken,
      },
    });

    if (response.status === 400) {
      throw new ValidationError("Invalid request parameters.");
    }

    if (response.status === 403 || response.status === 401) {
      throw new AuthError(
        "Request is unauthorized or forbidden: " + (await response.text()),
      );
    }

    if (response.status === 429) {
      throw new AppError(
        "Too many requests to Monobank API. Please try again in 1 minute.",
        429,
      );
    }

    if (!response.ok) {
      const err = await response.text();
      throw new AppError(`Monobank API error: ${err}`, response.status);
    }

    return response.json();
  }

  async getClientInfo(userToken: string): Promise<MonobankClientInfo> {
    const requestUrl: string = this.baseURL + "/client-info";

    const data: MonobankClientInfo = await this.getApiResponse(
      userToken,
      requestUrl,
    );

    return data;
  }

  async getStatement(
    userToken: string,
    params: MonobankStatementParameters,
  ): Promise<MonobankTransaction[]> {
    const requestUrl = `${this.baseURL}//statement/${params.account}/${params.from}/${params.to}`;

    const data: MonobankTransaction[] = await this.getApiResponse(
      userToken,
      requestUrl,
    );
    return data;
  }
}
