export type EventDataDTO = {
  id: string;
  details: string;
  values?: Array<
    | string
    | {
        value: number;
        unit: string;
      }
  >;
  code?: string;
};
