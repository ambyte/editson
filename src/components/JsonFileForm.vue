<template>
  <div>
    <v-card class="mb-6">
      <v-card-text class="bg-primary">
        <h3 class="text-h6 mb-4 text-center">Edit existing or new JSON files</h3>
        <v-file-input v-model="selectedFiles" label="Choose JSON file" accept=".json,application/json"
          bg-color="surface" prepend-icon="mdi-upload" variant="solo-filled" @change="handleFileUpload" />
      </v-card-text>

      <div class="d-flex justify-space-between align-center">
        <v-tabs v-model="activeTab" color="secondary-text">
          <v-tab value="text">Json View</v-tab>
          <v-tab value="object">Object View</v-tab>
        </v-tabs>
        <div class="mr-4 mt-2">
          <v-btn color="primary" prepend-icon="mdi-download" @click="downloadJson"
            :disabled="!localJsonContent || Object.keys(localJsonContent).length === 0">
            Download
          </v-btn>
        </div>
      </div>

      <div class="h-96 mt-2">
        <v-tabs-window v-model="activeTab" class="overflow-visible">
          <v-tabs-window-item value="text" transition="none" reverse-transition="none">
            <JsonEditorVue v-model="localJsonContent"
              :class="['font-mono text-sm h-96', { 'jse-theme-dark': current.dark }]"
              placeholder="Upload a JSON file or enter valid JSON" :stringified="false" :mode="Mode.text"
              @update:model-value="handleJsonUpdate" />
          </v-tabs-window-item>

          <v-tabs-window-item value="object" transition="none" reverse-transition="none">
            <JsonObjectEditor :key="fileKey" v-model="localJsonContent as unknown as JsonValue"
              :class="['font-mono text-sm h-96', { 'jse-theme-dark': current.dark }]"
              placeholder="Upload a JSON file or enter valid JSON" @update:model-value="handleJsonObjectUpdate" />
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-card>

    <v-alert v-if="jsonError" type="error" variant="tonal" class="mb-4">
      {{ jsonError }}
    </v-alert>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import JsonEditorVue from 'json-editor-vue';
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
import { useTheme } from 'vuetify'
import { Mode } from 'vanilla-jsoneditor';
import JsonObjectEditor from './JsonObjectEditor.vue';

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

const { current } = useTheme();
const activeTab = ref('text');

const selectedFiles = ref<File[]>([]);
const uploadedFileName = ref<string>('');
const jsonError = ref<string>('');
const fileKey = ref<number>(0);

const localJsonContent = ref<Record<string, unknown>>({});

const handleFileUpload = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || files.length === 0) {
    localJsonContent.value = {};
    uploadedFileName.value = '';
    jsonError.value = '';
    fileKey.value++;
    return;
  }

  const file = files[0];
  uploadedFileName.value = file.name;

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    localJsonContent.value = parsed;
    jsonError.value = '';
    fileKey.value++; // Force component re-creation
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    jsonError.value = `Invalid JSON file: ${errorMessage}`;
    uploadedFileName.value = '';
  }
};

const handleJsonUpdate = (content: Record<string, unknown>): void => {
  try {
    localJsonContent.value = content;
    jsonError.value = '';
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    jsonError.value = `Invalid JSON: ${errorMessage}`;
  }
};

const handleJsonObjectUpdate = (content: JsonValue): void => {
  try {
    localJsonContent.value = content as Record<string, unknown>;
    jsonError.value = '';
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    jsonError.value = `Invalid JSON: ${errorMessage}`;
  }
};

const downloadJson = (): void => {
  try {
    const jsonString = JSON.stringify(localJsonContent.value, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = uploadedFileName.value || 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    jsonError.value = `Failed to download: ${errorMessage}`;
  }
};
</script>
