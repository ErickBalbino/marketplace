type Props = { params: { id: string } };

export default function ProductPage({ params }: Props) {
  return <div className="container py-8">Produto: {params.id}</div>;
}
