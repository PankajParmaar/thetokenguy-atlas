import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `journal/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    summary: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, required: false },
    topic: {
      type: "enum",
      options: ["authentication", "authorization", "access-management", "federation", "governance", "signals-risk", "workload-identity"],
      required: false,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("journal/", ""),
    },
    url: {
      type: "string",
      resolve: (doc) => `/journal/${doc._raw.flattenedPath.replace("journal/", "")}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "src/content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight, rehypeSlug],
  },
});