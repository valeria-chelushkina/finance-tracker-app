import {
  MonobankClientInfo,
  MonobankStatementParameters,
  MonobankTransaction,
} from "@server/types/monobankTypes.js";
import {
  AppError,
  ValidationError,
  AuthError,
} from "@server/errors/AppErrors.js";

const BASE_URL = "https://api.monobank.ua/personal";

export class MonobankClient {

  private async parseErrorText(response: Response): Promise<string> {
    const errText: string = await response.text();
    let errorMessage = errText;

    try {
      const parsed = JSON.parse(errText);
      return (errorMessage = parsed.errorDescription || errText);
    } catch {
      return errText;
    }
  }

  private async getApiResponse(userToken: string, requestUrl: string) {
    const response: Response = await fetch(requestUrl, {
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
        "Request is unauthorized or forbidden: " +
          (await this.parseErrorText(response)),
      );
    }

    if (response.status === 429) {
      throw new AppError(
        "Too many requests to Monobank API. Please try again in 1 minute.",
        429,
      );
    }

    if (!response.ok) {
      throw new AppError(
        `Monobank API error: ${await this.parseErrorText(response)}`,
        response.status,
      );
    }

    return response.json();
  }

  async getClientInfo(userToken: string): Promise<MonobankClientInfo> {
    const requestUrl: string = BASE_URL + "/client-info";

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
    const requestUrl = `${BASE_URL}/statement/${params.account}/${params.from}/${params.to ? params.to : ""}`;

    const data: MonobankTransaction[] = await this.getApiResponse(
      userToken,
      requestUrl,
    );
    return data;
  }
}
