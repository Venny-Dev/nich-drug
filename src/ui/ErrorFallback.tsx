function ErrorFallback({ error, resetErrorBoundary }: any) {
  console.log(error);
  return (
    <main className="h-screen flex items-center justify-center p-[4.8rem]">
      <div className="flex flex-col items-center text-center flex-[0_1_96rem] p-[4.8rem] border rounded-[16px]">
        <h3 className="mb-[1.6rem]">Something went wrong:</h3>
        <p className="mb-[3.2rem]">
          Error continuing this operation 😥 If offline, try coming online and
          try again
        </p>
        <button
          onClick={resetErrorBoundary}
          className="bg-[#37589F99] py-[14px] text-[16px] font-medium text-white w-full rounded-[16px] max-w-[300px]"
        >
          Try again
        </button>
      </div>
    </main>
  );
}

export default ErrorFallback;
