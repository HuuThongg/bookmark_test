<script context="module" lang="ts">
  import { ArrowLeft, Folder, FolderOpen } from "lucide-svelte";
  import JS from "./icons/JS.svelte";
  import Svelte from "./icons/Svelte.svelte";

  type Icon = "svelte" | "folder" | "js";

  export type TreeItem = {
    title: string;
    icon: Icon;
    children?: TreeItem[];
  };

  export const icons = {
    svelte: Svelte,
    folder: Folder,
    folderOpen: FolderOpen,
    js: JS,
    highlight: ArrowLeft,
  };
</script>

<script lang="ts">
  import { melt, type TreeView } from "@melt-ui/svelte";
  import { getContext } from "svelte";
  import { goto } from "$app/navigation";
  import { treeItemsStore, flattenedTreeItems } from "$lib/store";
  export let treeItems: TreeItem[];
  export let level = 1;
  const {
    elements: { item, group },
    helpers: { isExpanded, isSelected },
    states: {
      expanded: { get },
      selectedItem,
    },
  } = getContext<TreeView>("tree");
</script>

{#each treeItems as { title, icon, children }, i}
  {@const itemId = `${title}-${i}`}
  {@const hasChildren = !!children?.length}

  <li class={level !== 1 ? "pl-4" : ""}>
    <button
      class="flex items-center gap-1 rounded-md p-1 focus:bg-magnum-200"
      use:melt={$item({ id: itemId, hasChildren })}
      aria-expanded={$isExpanded(itemId)}
      on:m-click={async () => {
        console.log("srat onclick");
        await goto(`/test/${title}`, { keepFocus: true });
        console.log("end onclick");
      }}
      on:m-keydown={async (e) => {
        let nextItem;
        if (e.detail.originalEvent.code === "ArrowDown") {
          if ($isExpanded(itemId) && treeItems[i]?.children?.[0]) {
            nextItem = treeItems[i].children[0]; // First child
          } else if (treeItems[i + 1]) {
            nextItem = treeItems[i + 1]; // Next sibling
          } else {
            let index = flattenedTreeItems.findIndex((e) => e.title === title);
            nextItem = flattenedTreeItems[index + 1];
          }
          await goto(`/test/${nextItem.title}`, { keepFocus: true });
        }
        if (e.detail.originalEvent.code === "ArrowUp") {
          if ($isExpanded(itemId) && treeItems[i]?.children?.[0]) {
            nextItem = treeItems[i].children[0]; // First child
          } else if (treeItems[i - 1]) {
            nextItem = treeItems[i - 1];
          } else {
            let index = flattenedTreeItems.findIndex((e) => e.title === title);

            nextItem = flattenedTreeItems[index - 1];
          }
          await goto(`/test/${nextItem.title}`, { keepFocus: true });
        }
      }}
      data-id={itemId}
    >
      <!-- Toggle icon -->
      {#if icon === "folder" && hasChildren && $isExpanded(itemId)}
        <svelte:component this={icons["folderOpen"]} class="h-4 w-4" />
      {:else}
        <svelte:component this={icons[icon]} class="h-4 w-4" />
      {/if}

      <span class="select-none">{title} {" "} {i}</span>

      <!-- Selected icon -->
      {#if $isSelected(itemId)}
        <svelte:component this={icons["highlight"]} class="h-4 w-4" />
      {/if}
    </button>
    {#if children}
      <ul use:melt={$group({ id: itemId })}>
        <svelte:self treeItems={children} level={level + 1} />
      </ul>
    {/if}
  </li>
{/each}

<style>
  /* Remove focus box-shadow styling */
  li:focus {
    box-shadow: none !important;
  }
</style>
