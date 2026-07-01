export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <main><h1>{slug}</h1></main>
}