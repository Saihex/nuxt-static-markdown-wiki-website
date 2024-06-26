import type { AsyncDataRequestStatus } from "#app";
import type { RouteLocationNormalizedLoaded } from "vue-router";

interface category_search_result {
  title: string;
  description: string;
  image: string;
  dynamic_path: string;
  spoiler: boolean;
  last_modified: number;
}

export default interface franchise_data {
  title: string;
  description: string;
  ico_image: string;
  wiki_head_image: string;
  default_embed_image: string;
  image: string;
  franchise_proper_name: String;
  page_count: Number;
  dynamic_path: String;
  saihex_creation: boolean;
  last_modified: number;
}

interface search_result {
  title: string;
  description: string;
  image: string;
  dynamic_route: string;
  spoiler: boolean;
  last_modified: number;
}

interface markdown_return {
  markdown_string: string;
  franchise_data: franchise_data;
}

const check_error = function (
  status: globalThis.Ref<AsyncDataRequestStatus>,
  error: any,
  route: RouteLocationNormalizedLoaded
) {
  if (status.value == "error" && error.value && error.value.statusCode == 404) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found",
    });
  } else if (
    (error.value && error.value.statusCode == 500) ||
    typeof route.params.franchise != "string"
  ) {
    throw createError({
      statusCode: 500,
      statusMessage: "Oop",
    });
  }
};

export const fetch_search = async function (
  path: string,
  route: RouteLocationNormalizedLoaded
) {
  // Run the requests in parallel
  const search_return = await useFetch(`/api/get_markdown/${path}`, {
    server: true,
  });

  // Destructure the responses
  const { data: searchList, status, error } = search_return;

  const value = searchList.value as unknown as {
    search_list: search_result[];
    franchise_data: franchise_data;
  };

  if (
    typeof value !== "object" || // Check if value is not an object
    value === null || // Check if value is null
    typeof value.search_list !== "object" || // Check if markdown_string is not a string
    typeof value.franchise_data !== "object" // Check if franchise_data is not a string
  ) {
    throw createError({
      statusCode: 500,
      statusMessage: "Oop",
    });
  }

  check_error(status, error, route);

  const search_results = value.search_list;
  const franchise_data = value.franchise_data;

  return { search_results, franchise_data };
};

export const fetch_last_changed = async function (path: string): Promise<number> {
  // Run the requests in parallel
  const last_changed = await useFetch(`/api/last_changed/${path}`, {
    server: true,
  });

  const { data: last_changed_data, status, error } = last_changed;

  const value = last_changed_data.value as number;

  return value;
};

export const fetch_markdown_parse = async function (
  path: string,
  route: RouteLocationNormalizedLoaded
) {
  // Run the requests in parallel
  const used_path = `/api/get_markdown/${path}`;
  const markdown_return = await useFetch(used_path, {
    server: true,
  });

  // Destructure the responses
  const { data: markdownString, status, error } = markdown_return;

  if (error.value && error.value?.statusCode != 200) {
    throw createError({
      statusCode: error.value?.statusCode,
      statusMessage: "",
    });
  }

  const value = markdownString.value as markdown_return;

  if (
    typeof value !== "object" || // Check if value is not an object
    value === null || // Check if value is null
    typeof value.markdown_string !== "string" || // Check if markdown_string is not a string
    typeof value.franchise_data !== "object" // Check if franchise_data is not a string
  ) {
    throw createError({
      statusCode: 500,
      statusMessage: "Oop",
    });
  }

  check_error(status, error, route);

  value.markdown_string = value.markdown_string.replace(
    "](./",
    `](${route.params.franchise}/`
  );

  const parsed_markdown = await parseMarkdown(value.markdown_string);
  const franchise_data = value.franchise_data;
  return { parsed_markdown, franchise_data, used_path };
};

export const fetch_category_search = async function (
  franchise: string,
  search_input: string
) {
  // Run the requests in parallel
  const search_return = await useFetch(`/api/search/category/${franchise}`, {
    server: true,
    params: {
      search_input: search_input,
    },
  });

  // Destructure the responses
  const { data: searchList, status, error } = search_return;

  const value = searchList.value as unknown as category_search_result[];

  if (
    value === null || // Check if value is null
    typeof value !== "object"
  ) {
    throw createError({
      statusCode: 500,
      statusMessage: "Oop",
    });
  }

  return value;
};

export const fetch_category_content_search = async function (
  franchise: string,
  category: string,
  search_input: string
) {
  // Run the requests in parallel
  const search_return = await useFetch(
    `/api/search/cat_contents/${franchise}`,
    {
      server: true,
      params: {
        search_input: search_input,
        catalog: category,
      },
    }
  );

  // Destructure the responses
  const { data: searchList, status, error } = search_return;

  const value = searchList.value as unknown as category_search_result[];

  if (
    value === null || // Check if value is null
    typeof value !== "object"
  ) {
    throw createError({
      statusCode: 500,
      statusMessage: "Oop",
    });
  }

  return value;
};

export const fetch_search_wikis = async function (search_input: string) {
  // Run the requests in parallel
  const search_return = await useFetch(`/api/search/wiki_search`, {
    server: true,
    params: {
      search_input: search_input,
    },
  });

  // Destructure the responses
  const { data: searchList, status, error } = search_return;

  const value = searchList.value as unknown as franchise_data[];

  if (
    value === null || // Check if value is null
    typeof value !== "object"
  ) {
    throw createError({
      statusCode: 500,
      statusMessage: "Oop",
    });
  }

  return value;
};
