type Props = { params: { name: string } };

export default function ProductPage({ params }: Props) {
  return <div className="container py-8">Produto: {params.name}</div>;
}
