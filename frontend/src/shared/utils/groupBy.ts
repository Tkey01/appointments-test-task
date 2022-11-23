export type EntityType<T> = Array<T> | { [key: string]: EntityType<T> };

export const groupBy = <T>(
  array: Array<T>,
  getKey: (current: T) => string
): { [key: string]: Array<T> } =>
  array.reduce<{ [key: string]: Array<T> }>((acc, current) => {
    const key = getKey(current);

    if (Object.hasOwn(acc, key)) {
      acc[key].push(current);
    } else {
      acc[key] = [current];
    }

    return acc;
  }, {});

export const recursiveGroupBy = <T>(
  entity: EntityType<T>,
  condition: (arg: T) => string
): EntityType<T> => {
  if (Array.isArray(entity)) {
    return groupBy(entity, condition);
  } else {
    Object.keys(entity).forEach((key) => {
      entity[key] = recursiveGroupBy(entity[key], condition);
    });
    return entity;
  }
};

export const combineGroupBy = <T>(
  entity: EntityType<T>,
  conditions: Array<(arg: T) => string>
): EntityType<T> => {
  for (let i = 0; i < conditions.length; i++) {
    entity = recursiveGroupBy<T>(entity, conditions[i]);
  }
  return entity;
};
