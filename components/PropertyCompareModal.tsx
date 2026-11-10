'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Cancel,
  CompareArrows,
  Bed,
  Bathtub,
  SquareFoot,
  LocationOn,
  Verified
} from '@mui/icons-material';
import { House } from '@/types/houses';
import Link from 'next/link';

interface PropertyCompareModalProps {
  open: boolean;
  onClose: () => void;
  properties: House[];
  onRemoveProperty?: (id: string) => void;
}

export default function PropertyCompareModal({
  open,
  onClose,
  properties,
  onRemoveProperty
}: PropertyCompareModalProps) {
  if (properties.length === 0) return null;

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001/api';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'background.paper',
          backgroundImage: 'none'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CompareArrows sx={{ color: '#06b6d4', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              MAT Engineering Product Comparison
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Comparing {properties.length} {properties.length === 1 ? 'product' : 'products'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 160, fontWeight: 700, bgcolor: 'background.paper' }}>
                  Features
                </TableCell>
                {properties.map((prop) => (
                  <TableCell
                    key={prop._id}
                    sx={{ minWidth: 260, verticalAlign: 'top', bgcolor: 'background.paper' }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      {onRemoveProperty && properties.length > 1 && (
                        <Tooltip title="Remove from comparison">
                          <IconButton
                            size="small"
                            onClick={() => onRemoveProperty(prop._id)}
                            sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'action.hover' }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Box
                        component="img"
                        src={`${serverUrl}/public/houses/${prop._id}/image`}
                        alt={prop.title}
                        onError={(e: any) => {
                          e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80';
                        }}
                        sx={{
                          width: '100%',
                          height: 140,
                          objectFit: 'cover',
                          borderRadius: 2,
                          mb: 1.5
                        }}
                      />

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Chip
                          size="small"
                          label={prop.transactionType || 'RENT'}
                          sx={{
                            bgcolor: prop.transactionType === 'BUY' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                            color: prop.transactionType === 'BUY' ? '#10b981' : '#06b6d4',
                            fontWeight: 700,
                            fontSize: 11
                          }}
                        />
                        {prop.isVerified && (
                          <Chip
                            size="small"
                            icon={<Verified sx={{ fontSize: '14px !important', color: '#0284c7' }} />}
                            label="Verified"
                            sx={{ bgcolor: 'rgba(2, 132, 199, 0.12)', color: '#0284c7', fontWeight: 600, fontSize: 11 }}
                          />
                        )}
                      </Box>

                      <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 0.5, lineHeight: 1.3 }}>
                        {prop.title}
                      </Typography>

                      <Typography sx={{ color: '#06b6d4', fontWeight: 800, fontSize: 18, mb: 1 }}>
                        ETB {prop.pricing.price.toLocaleString()}
                        <Typography component="span" sx={{ fontSize: 12, color: 'text.secondary', ml: 0.5 }}>
                          {prop.transactionType === 'RENT' ? '/ month' : ''}
                        </Typography>
                      </Typography>

                      <Button
                        component={Link}
                        href={`/public/houses/${prop._id}`}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                      >
                        View Full Details
                      </Button>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Location */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                {properties.map((p) => (
                  <TableCell key={p._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOn fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {p.location.neighborhood ? `${p.location.neighborhood}, ` : ''}{p.location.city}
                      </Typography>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>

              {/* Property Category */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                {properties.map((p) => (
                  <TableCell key={p._id}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {p.propertyType}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>

              {/* SKU & Brand */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>SKU / Brand</TableCell>
                {properties.map((p) => (
                  <TableCell key={p._id}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {p.productAttributes?.sku || 'MAT-PRD'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {p.productAttributes?.brand || 'MAT Engineering & Trading PLC'}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>

              {/* Material & Grade */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Material & Grade</TableCell>
                {properties.map((p) => (
                  <TableCell key={p._id}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {p.productAttributes?.material || 'Certified Industrial Spec'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {p.productAttributes?.grade || 'ASTM / ISO Standard'}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>

              {/* Dimensions & Unit */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Dimensions / Unit</TableCell>
                {properties.map((p) => (
                  <TableCell key={p._id}>
                    <Typography variant="body2">
                      {p.productAttributes?.dimensions || `${p.details.area || 0} m²`}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Unit: {p.productAttributes?.unit || 'Pcs / Units'}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>

              {/* Lead Time & Stock */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Availability / Lead Time</TableCell>
                {properties.map((p) => (
                  <TableCell key={p._id}>
                    <Chip
                      size="small"
                      color="primary"
                      variant="outlined"
                      label={p.productAttributes?.stockQuantity != null ? `${p.productAttributes.stockQuantity} in stock` : 'In Stock'}
                      sx={{ mr: 1, mb: 0.5 }}
                    />
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                      Lead time: {p.productAttributes?.leadTime || 'Immediate / 3-5 days'}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>

              {/* 25% Advance Partial Payment */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Payment Options</TableCell>
                {properties.map((p) => (
                  <TableCell key={p._id}>
                    <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 700 }}>
                      25% Advance: ETB {(p.pricing.price * 0.25).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      75% Final upon completion: ETB {(p.pricing.price * 0.75).toLocaleString()}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>

              {/* Tags */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Tags & Badges</TableCell>
                {properties.map((p) => (
                  <TableCell key={p._id}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(p.tags || []).map((t, i) => (
                        <Chip key={i} size="small" label={`#${t}`} sx={{ fontSize: 11 }} />
                      ))}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>

              {/* Amenities */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Amenities Included</TableCell>
                {properties.map((p) => (
                  <TableCell key={p._id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {(p.details.amenities || []).map((a, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CheckCircle sx={{ color: '#10b981', fontSize: 14 }} />
                          <Typography variant="body2" sx={{ fontSize: 13 }}>{a}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ px: 4, borderRadius: 2 }}>
          Close Comparison
        </Button>
      </DialogActions>
    </Dialog>
  );
}
