<template>
  <v-lazy :options="{ 'threshold': 0.5 }" transition="fade-transition">
    <div v-if="typeof modelValue === 'object' && modelValue !== null">
      <v-expansion-panels class="mt-2" variant="accordion" multiple>
        <v-expansion-panel v-for="(value, key) in modelValue" :key="String(key)" class="mb-1" max-height="60">
          <v-lazy :options="{ 'threshold': 0.5 }" transition="fade-transition">
            <v-card class="pa-0" color="panels">
              <v-expansion-panel-title class="pl-0 ">
                <div class="d-flex ga-2 pt-6" style="width: 70%;">
                  <v-btn icon variant="plain" size="small" color="error" class=" align-self-stretch"
                    @click.stop="removeProperty(String(key))">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-select :model-value="getValueType(value as JsonValue)" max-width="130" min-width="120"
                    density="compact" :items="valueTypes" label="Type" variant="outlined"
                    @update:model-value="changeValueType(String(key), $event)" @click.stop />
                  <v-chip v-if="Array.isArray(modelValue)" color="secondary-text" variant="text" size="large" text>Index
                    {{ String(key) }}</v-chip>

                  <v-text-field v-else :ref="setFieldRefCurried(String(key))" :model-value="String(key)" min-width="150"
                    density="compact" label="Key" variant="outlined" :error="hasKeyError(String(key))"
                    @update:model-value="(newKey) => updateKey(String(key), newKey)" @click.stop />
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="mt-2">
                  <v-textarea v-if="typeof value === 'string'" :model-value="value" hide-details rows="1" auto-grow
                    label="String value" variant="outlined" density="compact"
                    @update:model-value="updateValue(String(key), $event)" @click.stop />

                  <v-text-field v-else-if="typeof value === 'number'" :model-value="value" max-width="660" hide-details
                    label="Number value" variant="outlined" density="compact" type="number"
                    @update:model-value="updateValue(String(key), Number($event))" @click.stop />

                  <v-switch v-else-if="typeof value === 'boolean'" :model-value="value" hide-details class="ml-8"
                    label="Value" base-color="secondary" color="success" density="compact"
                    @update:model-value="updateValue(String(key), $event)" @click.stop />

                  <div v-else-if="value === null" class="text-grey">
                    Null value
                  </div>

                  <v-card v-else-if="typeof value === 'object' && value !== null" class="pa-0" variant="outlined"
                    hide-details>
                    <JsonObjectEditor v-if="typeof value === 'object'" :model-value="value as JsonValue"
                      @update:model-value="(val) => updateNestedValue(String(key), val)" />
                  </v-card>
                </div>
              </v-expansion-panel-text>
            </v-card>
          </v-lazy>
        </v-expansion-panel>

      </v-expansion-panels>

      <div class="pl-1 mt-1 mb-2">
        <v-btn v-if="!Array.isArray(modelValue)" color="secondary-text" variant="tonal" prepend-icon="mdi-plus"
          @click="addProperty()">
          Add Property
        </v-btn>
        <div v-else>
          <div class="d-flex align-center mb-2">
            <span class="text-body-2 mr-2">Add array item:</span>
          </div>
          <div class="d-flex flex-wrap ga-1">
            <v-btn color="secondary-text" variant="tonal" size="small" @click="addProperty('string')">
              + String
            </v-btn>
            <v-btn color="secondary-text" variant="tonal" size="small" @click="addProperty('number')">
              + Number
            </v-btn>
            <v-btn color="secondary-text" variant="tonal" size="small" @click="addProperty('boolean')">
              + Boolean
            </v-btn>
            <v-btn color="secondary-text" variant="tonal" size="small" @click="addProperty('null')">
              + Null
            </v-btn>
            <v-btn color="secondary-text" variant="tonal" size="small" @click="addProperty('object')">
              + Object
            </v-btn>
            <v-btn color="secondary-text" variant="tonal" size="small" @click="addProperty('array')">
              + Array
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-4">
      <p class="text-body-1 text-medium-emphasis">JSON must be an object or array to use the Object Editor
      </p>
      <v-btn color="secondary-text" class="mt-2" @click="initializeObject">Initialize as empty
        object</v-btn>
    </div>
  </v-lazy>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ComponentPublicInstance } from 'vue';

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

function isJsonObject(value: JsonValue): value is { [key: string]: JsonValue } {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isJsonArray(value: JsonValue): value is JsonValue[] {
  return Array.isArray(value);
}

interface Props {
  modelValue: JsonValue;
  placeholder?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:model-value': [value: JsonValue]
}>();

const expandedProps = ref<string[]>([]);

const fieldRefs = ref<Map<string, HTMLElement | null>>(new Map());

const keysWithErrors = ref<Set<string>>(new Set());

type ComponentRef = { $el?: HTMLElement };

const setFieldRef = (el: ComponentRef | null, key: string) => {
  if (el?.$el) {
    fieldRefs.value.set(key, el.$el.querySelector('input'));
  } else {
    fieldRefs.value.set(key, null);
  }
};

const setFieldRefCurried = (key: string) => (el: Element | ComponentPublicInstance | null) => setFieldRef(el as ComponentRef | null, key);

const editingKey = ref<string | null>(null);

const valueTypes = ['string', 'number', 'boolean', 'null', 'object', 'array'];

const getValueType = (value: JsonValue): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

const hasKeyError = (key: string): boolean => {
  return keysWithErrors.value.has(key);
};

const clearKeyError = (key: string): void => {
  setTimeout(() => {
    keysWithErrors.value.delete(key);
  }, 3000);
};

const updateKey = (oldKey: string, newKey: string): void => {
  if (oldKey === newKey) return;

  if (newKey.trim() === '') return;

  if (!isJsonObject(props.modelValue)) return;

  if (newKey in props.modelValue && newKey !== oldKey) {
    keysWithErrors.value.add(oldKey);
    clearKeyError(oldKey);
    return;
  }

  keysWithErrors.value.delete(oldKey);

  editingKey.value = newKey;

  if (isJsonArray(props.modelValue)) {
    editingKey.value = oldKey;
    return;
  }

  const updatedObj: Record<string, JsonValue> = {};
  const oldObj = props.modelValue;

  for (const key in oldObj) {
    if (key === oldKey) {
      updatedObj[newKey] = oldObj[key]!;
    } else {
      updatedObj[key] = oldObj[key]!;
    }
  }

  emit('update:model-value', updatedObj);

  setTimeout(() => {
    const inputElement = fieldRefs.value.get(newKey);
    if (inputElement instanceof HTMLElement) {
      inputElement.focus();
      const inputField = inputElement as HTMLInputElement;
      if (inputField.setSelectionRange) {
        const length = newKey.length;
        inputField.setSelectionRange(length, length);
      }
    }
    editingKey.value = null;
  }, 50);
};

const updateValue = (key: string, newValue: JsonValue): void => {
  if (isJsonArray(props.modelValue)) {
    const updatedObj = [...props.modelValue];
    updatedObj[Number(key)] = newValue;
    emit('update:model-value', updatedObj);
  } else if (isJsonObject(props.modelValue)) {
    const updatedObj = { ...props.modelValue };
    updatedObj[key] = newValue;
    emit('update:model-value', updatedObj);
  }
};

const updateNestedValue = (key: string, newValue: JsonValue): void => {
  if (isJsonArray(props.modelValue)) {
    const updatedObj = [...props.modelValue];
    updatedObj[Number(key)] = newValue;
    emit('update:model-value', updatedObj);
  } else if (isJsonObject(props.modelValue)) {
    const updatedObj = { ...props.modelValue };
    updatedObj[key] = newValue;
    emit('update:model-value', updatedObj);
  }
};

const removeProperty = (key: string): void => {
  if (isJsonArray(props.modelValue)) {
    const updatedObj = [...props.modelValue];
    updatedObj.splice(Number(key), 1);
    emit('update:model-value', updatedObj);
  } else if (isJsonObject(props.modelValue)) {
    const updatedObj = Object.fromEntries(
      Object.entries(props.modelValue).filter(([k]) => k !== key)
    );
    emit('update:model-value', updatedObj);
  }
};

const addProperty = (defaultType = 'string'): void => {
  if (isJsonArray(props.modelValue)) {
    const updatedObj = [...props.modelValue];

    switch (defaultType) {
      case 'string':
        updatedObj.push('');
        break;
      case 'number':
        updatedObj.push(0);
        break;
      case 'boolean':
        updatedObj.push(false);
        break;
      case 'null':
        updatedObj.push(null);
        break;
      case 'object':
        updatedObj.push({} as Record<string, JsonValue>);
        break;
      case 'array':
        updatedObj.push([] as JsonValue[]);
        break;
      default:
        updatedObj.push('');
    }

    emit('update:model-value', updatedObj);
  } else if (isJsonObject(props.modelValue)) {
    const updatedObj = { ...props.modelValue };
    let newKey = 'newProperty';
    let counter = 1;

    while (newKey in updatedObj) {
      newKey = `newProperty${counter}`;
      counter++;
    }

    updatedObj[newKey] = '';

    emit('update:model-value', updatedObj);
  }
};

const changeValueType = (key: string, newType: string): void => {
  let updatedObj: JsonValue;

  if (isJsonArray(props.modelValue)) {
    updatedObj = [...props.modelValue];
    const index = Number(key);

    switch (newType) {
      case 'string':
        updatedObj[index] = String(updatedObj[index] ?? '');
        break;
      case 'number':
        updatedObj[index] = Number(updatedObj[index] ?? 0);
        break;
      case 'boolean':
        updatedObj[index] = Boolean(updatedObj[index]);
        break;
      case 'null':
        updatedObj[index] = null;
        break;
      case 'object':
        updatedObj[index] = {};
        break;
      case 'array':
        updatedObj[index] = [];
        break;
    }

    emit('update:model-value', updatedObj);
  } else if (isJsonObject(props.modelValue)) {
    updatedObj = { ...props.modelValue };

    switch (newType) {
      case 'string':
        updatedObj[key] = String(updatedObj[key] ?? '');
        break;
      case 'number':
        updatedObj[key] = Number(updatedObj[key] ?? 0);
        break;
      case 'boolean':
        updatedObj[key] = Boolean(updatedObj[key]);
        break;
      case 'null':
        updatedObj[key] = null;
        break;
      case 'object':
        updatedObj[key] = {};
        break;
      case 'array':
        updatedObj[key] = [];
        break;
    }

    emit('update:model-value', updatedObj);
  }
};

const initializeObject = (): void => {
  emit('update:model-value', {} as Record<string, JsonValue>);
};
</script>

<style scoped>
.json-object-editor {
  height: 100%;
  overflow-y: auto;
}
</style>
