import React, { useEffect, useState } from "react";
import { Result, Pagination, Spin, Empty } from "antd";
import { searchProductApi, getProductApi } from "../util/api";
import SearchBar from "../components/layout/SearchBar";
import FilterPanel from "../components/layout/FilterPanel";
import ProductList from "../components/layout/ProductList";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    q: "",
    category: "",
    minPrice: 0,
    maxPrice: 1000,
    featured: false,
    discount: false,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let res;
      if (filters.q || filters.category || filters.featured || filters.discount) {
        res = await searchProductApi({
          q: filters.q,
          category: filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          page,
          limit: pageSize,
        });
      } else {
        res = await getProductApi(page, pageSize);
      }

      setProducts(res?.items || []);
      setTotal(res?.totalItems || 0);
    } catch (error) {
      console.error("Fetch products error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  const handleSearch = (value) => {
    setFilters({ ...filters, q: value });
    setPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search bar */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Filter panel */}
      <div className="mb-6">
        <FilterPanel
          categories={["Truyện", "Tiểu thuyết", "Kiến thức", "Khoa học"]}
          filters={filters}
          onChange={handleFilterChange}
        />
      </div>

      {/* Products */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : products.length === 0 ? (
        <Empty description="Không tìm thấy sản phẩm nào" style={{ marginTop: 50 }} />
      ) : (
        <>
          <ProductList products={products} />

          <div className="flex flex-col items-center mt-8 space-y-3">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
            <p className="text-gray-500">Tổng số kết quả: {total}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
