"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import { CircularProgress, Pagination, Box, Typography, Button, Rating, useTheme } from "@mui/material"
import { Spin } from "antd"
import { useGetProducts } from "@/hooks/useProduct"
import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"
import { styled } from "@mui/material/styles"
import { FaShoppingCart, FaUnlock, FaStar } from "react-icons/fa"

const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    color: "#ffffff",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: '0.375rem',
    [theme.breakpoints.down('sm')]: {
      minWidth: '32px',
      height: '32px',
      width: '32px',
      fontSize: '0.8rem',
    },
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
  },
  "& .MuiPaginationItem-page.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: "#ffffff",
    fontWeight: "bold",
    height: '32px',
    width: '32px',
    [theme.breakpoints.up('sm')]: {
      height: '40px',
      width: '40px',
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  "& .MuiPaginationItem-ellipsis": {
    color: "#ffffff",
    opacity: 0.6,
    [theme.breakpoints.down('sm')]: {
      minWidth: '20px',
      height: '28px',
    },
  },
  "& .MuiPaginationItem-previousNext": {
    color: "#ffffff",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    [theme.breakpoints.down('sm')]: {
      height: '32px',
      width: '32px',
    },
  },
}));

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const theme = useTheme()
  const { data: products, isLoading } = useGetProducts(currentPage, pageSize)
  
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
          width: "100%",
          backgroundColor: "#f9fafb",
        }}
      >
        <Spin size="large" />
      </Box>
    )
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  return (
    <Box sx={{
      backgroundImage: "url('/images/background.jpg')", 
      backgroundSize: "cover", 
      backgroundPosition: "center", 
      maxWidth: "lg", 
      borderRadius: "0.375rem", 
      pb: 14, 
      mx: "auto", 
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      {/* Header */}
      <Box sx={{ 
        textAlign: "center", 
        py: 3, 
        mb: 2,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "0.375rem",
        mt: 2
      }}>
        <Typography variant="h5" component="h1" sx={{ color: "white", fontWeight: "bold" }}>
          SaigonCentre Shop
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
          Sản phẩm chất lượng cao
        </Typography>
      </Box>
      
      {/* Cards Section */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, padding: 2, paddingLeft: 0, paddingRight: 0 }}>
        {isLoading ? (
          <Box
            sx={{
              gridColumn: "span 2",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "10rem",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          products?.data?.map((product) => (
            <Box
              key={product.id}
              sx={{
                backgroundColor: "white",
                borderRadius: "0.375rem",
                boxShadow: theme.shadows[1],
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[3],
                }
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  aspectRatio: "1/1",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "#ef4444",
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    padding: "0.125rem 0.5rem",
                    margin: "0.5rem",
                    borderRadius: "0.25rem",
                    zIndex: 10,
                    transition: "all 0.3s",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#dc2626",
                    },
                  }}
                >
                  Mới
                </Box>
                <Image
                  src={product.imageUrls?.[0] || 
                    [
                      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=500&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=500&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=500&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?q=80&w=500&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?q=80&w=500&auto=format&fit=crop",
                    ][Math.floor(Math.random() * 6)]
                  }
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "contain" }}
                  className="p-4"
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(14, 37, 50, 0.8), transparent)",
                    height: "4rem",
                  }}
                >
                  <Button
                    size="small"
                    startIcon={<FaUnlock />}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      bottom: "0.25rem",
                      left: "0.25rem",
                      backgroundColor: "#ef4444",
                      color: "white",
                      padding: "0.125rem 0.5rem",
                      height: "24px",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      transition: "all 0.3s",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#dc2626",
                      },
                    }}
                  >
                   <span className="text-xs">Mở khóa</span>
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  padding: "0.75rem",
                  backgroundColor: "#0E2532",
                  color: "white",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: "bold",
                    mb: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  {product.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm: "column" },
                    justifyContent: "space-between",
                    alignItems: { xs: "center", sm: "flex-start" },
                    width: "100%",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: "#ef4444", fontWeight: "bold" }}>
                    {Number(product.price).toLocaleString("vi-VN")}đ
                  </Typography>
                  <Rating 
                    value={5} 
                    readOnly 
                    size="small" 
                    icon={<FaStar style={{ color: "#fbbf24" }} />}
                    emptyIcon={<FaStar style={{ color: "rgba(255,255,255,0.2)" }} />}
                  />
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {products?.meta?.itemCount && products?.meta?.itemCount > 0 && products?.meta?.pageCount && products.meta.pageCount > 1 && (
        <Box sx={{ 
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "0.375rem", 
          paddingTop: 1, 
          paddingBottom: 1,  
          display: "flex", 
          justifyContent: "center", 
          mt: 2 
        }}>
          <StyledPagination
            count={products.meta.pageCount}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size={theme.breakpoints.up('sm') ? 'large' : 'medium'}
            boundaryCount={1}
            siblingCount={theme.breakpoints.up('sm') ? 1 : 0}
          />
        </Box>
      )}
    </Box>
  )
}

