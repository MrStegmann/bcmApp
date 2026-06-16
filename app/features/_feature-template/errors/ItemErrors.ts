class ItemsFeatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ItemsFeatureError";
  }
}

class ItemsFetchError extends ItemsFeatureError {
  constructor(message = "No se pudo cargar la lista de items.") {
    super(message);
    this.name = "ItemsFetchError";
  }
}

class ItemsDeleteError extends ItemsFeatureError {
  constructor(message = "No se pudo eliminar el item. Intentalo de nuevo.") {
    super(message);
    this.name = "ItemsDeleteError";
  }
}

class ItemsSaveError extends ItemsFeatureError {
  constructor(message = "No se pudo guardar el item. Intentalo de nuevo.") {
    super(message);
    this.name = "ItemsSaveError";
  }
}

const getItemsErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (error instanceof ItemsFeatureError) {
    return error.message;
  }

  return fallbackMessage;
};

export {
  ItemsFeatureError,
  ItemsFetchError,
  ItemsSaveError,
  ItemsDeleteError,
  getItemsErrorMessage,
};
