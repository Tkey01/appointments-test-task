import { EventDataDTO, EventDTO } from "features/History/store/dto";
import { api } from ".";
import { AxiosError } from "axios";
import { Status } from "shared/types";

export type ApiResponse<T> =
  | {
      status: Status.succeed;
      data: T;
    }
  | {
      status: Status.failed;
      errorText: string;
    };

export class ApiClient {
  public static async getEventsList(): Promise<ApiResponse<EventDTO[]>> {
    try {
      const {
        data: { items },
      } = await api.post<{ items: EventDTO[] }>("/events");
      return {
        status: Status.succeed,
        data: items,
      };
    } catch (err: unknown) {
      let errorText = "Unknown error";
      if (err instanceof AxiosError) {
        errorText = err.message;
      }
      return {
        status: Status.failed,
        errorText,
      };
    }
  }
  public static async getEventsData(
    ids: string[]
  ): Promise<ApiResponse<EventDataDTO[]>> {
    try {
      const {
        data: { items },
      } = await api.post<{ items: EventDataDTO[] }>("/resources", { ids });
      return {
        status: Status.succeed,
        data: items,
      };
    } catch (err: unknown) {
      let errorText = "Unknown error";
      if (err instanceof AxiosError) {
        errorText = err.message;
      }
      return {
        status: Status.failed,
        errorText,
      };
    }
  }
}
