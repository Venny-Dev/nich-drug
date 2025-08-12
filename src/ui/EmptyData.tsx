function EmptyData({ text }: { text: string }) {
  return (
    <div className="bg-white px-5  py-4 text-center text-[24px] font-normal text-[#88918B]">
      <p className="max-w-[350px] mx-auto">{text}</p>
    </div>
  );
}

export default EmptyData;
