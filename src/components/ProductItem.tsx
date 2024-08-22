import Image from "next/image";

interface ProductItemProps {
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
}

export default function ProductItem({
  name,
  price,
  imageUrl,
  rating,
}: ProductItemProps) {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
      ★
    </span>
  ));

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <Image
        src={imageUrl}
        alt={name}
        width={300}
        height={200}
        className="mb-4 h-40 w-full object-cover"
      />
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-gray-600">${price.toFixed(2)}</p>
      <div className="flex items-center">{stars}</div>
    </div>
  );
}
