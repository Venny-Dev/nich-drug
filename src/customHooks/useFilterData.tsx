import { useMemo } from "react";

function useFilterData(data: any, searchTerm: string) {
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter(
      (item: any) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id?.toString().includes(searchTerm) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemsSold?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  return filteredData;
}

export default useFilterData;
