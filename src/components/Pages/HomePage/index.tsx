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

const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    color: "#ffffff",
    borderRadius: '50%',
    [theme.breakpoints.down('sm')]: {
      minWidth: '32px',
      height: '32px',
      width: '32px',
      fontSize: '0.8rem',
    },
  },
  "& .MuiPaginationItem-page.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
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
    "&.MuiPaginationItem-root": {
       color: theme.palette.primary.contrastText,
    }
  },
  "& .MuiPaginationItem-page:hover": {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : theme.palette.action.hover,
  },
  "& .MuiPaginationItem-ellipsis": {
    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.disabled,
    opacity: 0.6,
    [theme.breakpoints.down('sm')]: {
      minWidth: '20px',
      height: '28px',
    },
  },
  "& .MuiPaginationItem-previousNext": {
    
    color: "#ffffff",
    "&:hover": {
       backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : theme.palette.action.hover,
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
    <Box sx={{ maxWidth: "lg", borderRadius: "0.375rem", pb: 14, mx: "auto", px: { xs: 2, sm: 3, md: 4 } }}>

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
                    backgroundColor: "#60A5FA",
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    padding: "0.125rem 0.5rem",
                    margin: "0.5rem",
                    borderRadius: "0.125rem",
                    zIndex: 10,
                    transition: "all 0.3s",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#60A5FA",
                    },
                  }}
                >
                  Mới
                </Box>
                <Image
                  src={product.imageUrls?.[0] || "/images/white-image.png"}
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
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      bottom: "0.25rem",
                      left: "0.25rem",
                      backgroundColor: "#60A5FA",
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
                        backgroundColor: "#60A5FA",
                      },
                    }}
                  >
                   <span className="text-xs"> Mở khóa</span>
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  padding: "0.5rem",
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
                    alignItems: { xs: "center", sm: "center" },
                    width: "100%",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: theme.palette.error.main, fontWeight: "bold" }}>
                    {Number(product.price).toLocaleString("vi-VN")}đ
                  </Typography>
                  <Rating value={5} readOnly size="small" sx={{ color: "yellow" }} />
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {products?.meta?.itemCount && products?.meta?.itemCount > 0 && products?.meta?.pageCount && products.meta.pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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

