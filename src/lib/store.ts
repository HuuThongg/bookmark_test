import { derived, writable } from 'svelte/store';

const treeItems = [
  { title: "index.svelte", icon: "svelte" },
  {
    title: "lib",
    icon: "folder",
    children: [
      {
        title: "tree",
        icon: "folder",
        children: [
          {
            title: "Tree.svelte",
            icon: "svelte",
          },
          {
            title: "TreeView.svelte",
            icon: "svelte",
          },
        ],
      },
      {
        title: "icons",
        icon: "folder",
        children: [
          { title: "JS.svelte", icon: "svelte" },
          { title: "Svelte.svelte", icon: "svelte" },
        ],
      },
      {
        title: "index.js",
        icon: "js",
      },
    ],
  },
  {
    title: "routes",
    icon: "folder",
    children: [
      {
        title: "contents",
        icon: "folder",
        children: [
          {
            title: "+layout.svelte",
            icon: "svelte",
          },
          {
            title: "+page.svelte",
            icon: "svelte",
          },
        ],
      },
    ],
  },
];

const treeItemsStore = writable(treeItems);

function flattenTreeItems(treeItems) {
  const flattenedItems = [];

  function flatten(items) {
    items.forEach(item => {
      flattenedItems.push(item);
      if (item.children) {
        flatten(item.children);
      }
    });
  }

  flatten(treeItems);
  return flattenedItems;
}

const flattenedTreeItems = flattenTreeItems(treeItems);
const flattenedTreeItemsStore = derived(treeItemsStore, $treeItems => {
  return flattenTreeItems($treeItems);
});

export { flattenedTreeItemsStore };
export { treeItemsStore, flattenedTreeItems };

