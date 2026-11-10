'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, Tabs, Tab, Button,
  Chip, Avatar, Paper, Divider, IconButton, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Tooltip, Snackbar,
  Grid, Stack
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import {
  Favorite, Bookmark, CalendarMonth, Article, LocalOffer,
  Build, Receipt, CheckCircle, Warning, HourglassEmpty,
  Add, Close, Print, Visibility, LocationOn, Person, Phone, Email,
  ShoppingCart, Payment as PaymentIcon, Refresh, ArrowForward,
  Home, CheckCircleOutline, AccessTime, InfoOutlined, Description,
  Handyman, LocalShipping,
  FactCheck, Engineering, DoneAll, Storefront
} from '@mui/icons-material';
import { LinearProgress } from '@mui/material';
import api from '@/app/utils/api';
import { useLanguage } from '@/lib/language-context';
import { Appointment, LeaseAgreement, PurchaseOffer, MaintenanceRequest, SavedSearch, House, RentalApplication } from '@/types/houses';
import LeaseAgreementModal from '@/components/LeaseAgreementModal';
import PurchaseMilestonePaymentModal from '@/components/PurchaseMilestonePaymentModal';
import PurchaseReceiptModal from '@/components/PurchaseReceiptModal';
import Link from 'next/link';

export default function AdminCustomerPage() {
  const { theme } = useTheme();
  const { t, isAmharic, language } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [leases, setLeases] = useState<LeaseAgreement[]>([]);
  const [offers, setOffers] = useState<PurchaseOffer[]>([]);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceRequest[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [savedProperties, setSavedProperties] = useState<House[]>([]);

  // Selected Lease for full Agreement & Receipt Modal
  const [selectedLease, setSelectedLease] = useState<LeaseAgreement | null>(null);

  // Purchase Milestone Payment & Receipt states
  const [payingOffer, setPayingOffer] = useState<PurchaseOffer | null>(null);
  const [payingMilestone, setPayingMilestone] = useState<any | null>(null);
  const [receiptOffer, setReceiptOffer] = useState<PurchaseOffer | null>(null);
  const [receiptMilestone, setReceiptMilestone] = useState<any | null>(null);

  // Customer Counter-Offer state
  const [customerCounterOpen, setCustomerCounterOpen] = useState(false);
  const [counterOfferTarget, setCounterOfferTarget] = useState<PurchaseOffer | null>(null);
  const [counterAmount, setCounterAmount] = useState('');
  const [counterMessage, setCounterMessage] = useState('');
  const [counterSubmitting, setCounterSubmitting] = useState(false);

  // Confirm Product Taken loading
  const [confirmingTakenId, setConfirmingTakenId] = useState<string | null>(null);

  // New Maintenance Ticket Modal
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    houseId: '',
    category: 'PLUMBING',
    priority: 'MEDIUM',
    title: '',
    description: ''
  });
  const [ticketLoading, setTicketLoading] = useState(false);
  const [snackbar, setSnackbar] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');

  const fetchDashboardData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const [appRes, leaseRes, offerRes, maintRes, searchRes, appListRes] = await Promise.allSettled([
        api.get('/workflows/appointments'),
        api.get('/workflows/leases'),
        api.get('/workflows/offers'),
        api.get('/workflows/maintenance'),
        api.get('/properties/saved-searches'),
        api.get('/houses/applications')
      ]);

      if (appRes.status === 'fulfilled') setAppointments(appRes.value.data?.data || []);
      if (leaseRes.status === 'fulfilled') setLeases(leaseRes.value.data?.data || []);
      if (offerRes.status === 'fulfilled') setOffers(offerRes.value.data?.data || []);
      if (maintRes.status === 'fulfilled') setMaintenanceTickets(maintRes.value.data?.data || []);
      if (searchRes.status === 'fulfilled') setSavedSearches(searchRes.value.data?.data || []);
      if (appListRes.status === 'fulfilled') setApplications(appListRes.value.data?.data?.applications || []);

      // Fetch sample favorited properties
      try {
        const propRes = await api.get('/public/houses?limit=6');
        if (propRes.data?.success) {
          setSavedProperties(propRes.data.data?.houses || []);
        }
      } catch {
        // Optional property fallback
      }

      if (isManualRefresh) {
        setSnackbar('Customer portal data refreshed successfully!');
        setSnackbarSeverity('success');
      }
    } catch (err: any) {
      console.error('Failed to load customer portal data:', err);
      setSnackbar(err?.response?.data?.message || 'Error fetching customer data');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleConfirmProductTaken = async (offerId: string) => {
    try {
      setConfirmingTakenId(offerId);
      await api.post(`/workflows/offers/${offerId}/confirm-taken`);
      setSnackbar(isAmharic ? 'ምርቱ በተሳካ ሁኔታ ተረክበዋል! ርክክቡ ተረጋግጧል።' : 'Product successfully received & handover confirmed!');
      setSnackbarSeverity('success');
      fetchDashboardData(true);
    } catch (err: any) {
      setSnackbar(err?.response?.data?.message || 'Failed to confirm product taken');
      setSnackbarSeverity('error');
    } finally {
      setConfirmingTakenId(null);
    }
  };

  const handleSendCustomerCounter = async () => {
    if (!counterOfferTarget || !counterAmount) return;
    try {
      setCounterSubmitting(true);
      await api.post(`/workflows/offers/${counterOfferTarget._id}/negotiate`, {
        proposedAmount: Number(counterAmount),
        message: counterMessage || (isAmharic ? 'የደንበኛ የዋጋ ማሻሻያ ሀሳብ' : 'Customer counter-proposal')
      });
      setSnackbar(isAmharic ? 'የዋጋ ድርድር ሀሳብዎ ለሽያጭ ሰራተኛው ተልኳል!' : 'Counter-offer sent to Sales Staff successfully!');
      setSnackbarSeverity('success');
      setCustomerCounterOpen(false);
      setCounterAmount('');
      setCounterMessage('');
      fetchDashboardData(true);
    } catch (err: any) {
      setSnackbar(err?.response?.data?.message || 'Failed to send counter-proposal');
      setSnackbarSeverity('error');
    } finally {
      setCounterSubmitting(false);
    }
  };

  const handleCreateMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setTicketLoading(true);
      const targetHouseId = newTicket.houseId || leases[0]?.houseId?._id || leases[0]?.houseId;
      await api.post('/workflows/maintenance', {
        ...newTicket,
        houseId: targetHouseId
      });
      setSnackbar('Maintenance ticket submitted to Property Manager!');
      setSnackbarSeverity('success');
      setMaintenanceModalOpen(false);
      setNewTicket({ houseId: '', category: 'PLUMBING', priority: 'MEDIUM', title: '', description: '' });
      fetchDashboardData();
    } catch (err: any) {
      setSnackbar(err.response?.data?.message || 'Failed to submit maintenance ticket');
      setSnackbarSeverity('error');
    } finally {
      setTicketLoading(false);
    }
  };

  const handleDeleteSavedSearch = async (id: string) => {
    try {
      await api.delete(`/properties/saved-searches/${id}`);
      setSavedSearches(prev => prev.filter(s => s._id !== id));
      setSnackbar('Search alert removed');
      setSnackbarSeverity('info');
    } catch (err: any) {
      setSnackbar('Could not remove saved alert');
      setSnackbarSeverity('error');
    }
  };

  const isDark = theme === 'dark';

  const statCards = [
    { title: isAmharic ? 'የእኔ ጉብኝቶች' : 'My Viewings', count: appointments.length, icon: <CalendarMonth />, color: '#06b6d4', tabIndex: 0 },
    { title: isAmharic ? 'የኪራይ ማመልከቻዎች' : 'Rental Apps', count: applications.length, icon: <Description />, color: '#8b5cf6', tabIndex: 1 },
    { title: isAmharic ? 'ንቁ ውሎች' : 'Active Leases', count: leases.length, icon: <Article />, color: '#10b981', tabIndex: 2 },
    { title: isAmharic ? 'የግዢ ጥያቄዎች' : 'Purchase Offers', count: offers.length, icon: <LocalOffer />, color: '#f59e0b', tabIndex: 3 },
    { title: isAmharic ? 'የጥገና ጥያቄዎች' : 'Repair Tickets', count: maintenanceTickets.length, icon: <Build />, color: '#ef4444', tabIndex: 4 },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* ─── Top Header Section ─── */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 4 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: isDark ? '#ccd6f6' : '#0f172a' }}>
              {isAmharic ? 'የደንበኛ ፖርታል' : 'Customer Portal'}
            </Typography>
            <Chip
              size="small"
              label={isAmharic ? 'ማት ኢንጂነሪንግ' : 'MAT Engineering & Trading PLC'}
              sx={{
                bgcolor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)',
                color: isDark ? '#3b82f6' : '#2563eb',
                fontWeight: 700,
                border: isDark ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(37, 99, 235, 0.3)'
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>
            {isAmharic
              ? 'የቤቶች ጉብኝት፣ የኪራይ ውል፣ ደረሰኝ፣ የግዢ ጥያቄዎች እና የጥገና ጥያቄዎችን በአንድ ቦታ ይከታተሉ።'
              : 'Manage your property viewings, active lease contracts, rent receipts, purchase bids, and maintenance repairs.'}
          </Typography>
        </motion.div>

        {/* Action Shortcuts */}
        {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            component={Link}
            href="/admin/customer/orders"
            variant="outlined"
            startIcon={<ShoppingCart />}
            sx={{
              borderColor: isDark ? 'rgba(0, 255, 255, 0.3)' : '#cbd5e1',
              color: isDark ? '#00ffff' : '#0f172a',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              '&:hover': {
                borderColor: isDark ? '#00ffff' : '#0284c7',
                bgcolor: isDark ? 'rgba(0, 255, 255, 0.08)' : 'rgba(2, 132, 199, 0.05)'
              }
            }}
          >
            My Orders
          </Button>
          <Button
            component={Link}
            href="/admin/customer/payments"
            variant="outlined"
            startIcon={<PaymentIcon />}
            sx={{
              borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : '#cbd5e1',
              color: isDark ? '#34d399' : '#059669',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              '&:hover': {
                borderColor: '#10b981',
                bgcolor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.05)'
              }
            }}
          >
            My Payments
          </Button>
          <Tooltip title="Refresh customer data">
            <IconButton
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing || loading}
              sx={{
                bgcolor: isDark ? '#0f172a' : '#f1f5f9',
                color: isDark ? '#00ffff' : '#0284c7',
                border: isDark ? '1px solid rgba(0, 255, 255, 0.2)' : '1px solid #e2e8f0',
                '&:hover': { bgcolor: isDark ? 'rgba(0, 255, 255, 0.15)' : '#e2e8f0' }
              }}
            >
              <Refresh sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            </IconButton>
          </Tooltip>
        </Stack> */}
      </Box>

      {/* ─── Metric Highlight Cards ─── */}
<Box
  sx={{
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(5, 1fr)',
    },
    gap: 2.5,
    mb: 4,
  }}
>
  {statCards.map((stat, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.08 }}
    >
      <Card
        onClick={() => setActiveTab(stat.tabIndex)}
        sx={{
          cursor: 'pointer',
          borderRadius: 3,
          p: 0.5,
          height: '100%',
          transition: 'all 0.25s ease-in-out',
          bgcolor: isDark ? '#0f172a80' : '#ffffff',
          backdropFilter: isDark ? 'blur(10px)' : 'none',
          border: isDark ? '1px solid rgba(0, 255, 255, 0.15)' : '1px solid #e2e8f0',
          borderLeft: `5px solid ${stat.color}`,
          boxShadow:
            activeTab === stat.tabIndex
              ? isDark
                ? '0 0 15px rgba(0, 255, 255, 0.25)'
                : '0 4px 12px rgba(6, 182, 212, 0.2)'
              : 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: stat.color,
          },
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: isDark ? '#8892b0' : '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {stat.title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: isDark ? '#ccd6f6' : '#0f172a',
                mt: 0.5,
              }}
            >
              {stat.count}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: isDark ? `${stat.color}20` : `${stat.color}15`,
              color: stat.color,
              width: 48,
              height: 48,
              border: `1px solid ${stat.color}40`,
            }}
          >
            {stat.icon}
          </Avatar>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</Box>

      {/* ─── Navigation Tabs ─── */}
      <Card
        sx={{
          borderRadius: 3,
          mb: 4,
          bgcolor: isDark ? '#0f172a80' : '#ffffff',
          border: isDark ? '1px solid rgba(0, 255, 255, 0.15)' : '1px solid #e2e8f0',
          backdropFilter: isDark ? 'blur(10px)' : 'none'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              color: isDark ? '#8892b0' : '#64748b',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
              py: 2
            },
            '& .Mui-selected': {
              color: 'primary.main'
            },
            '& .MuiTabs-indicator': {
              bgcolor: 'primary.main',
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          <Tab icon={<CalendarMonth />} iconPosition="start" label={`${isAmharic ? 'የእኔ ጉብኝቶች' : 'My Viewings'} (${appointments.length})`} />
          <Tab icon={<Description />} iconPosition="start" label={`${isAmharic ? 'የኪራይ ማመልከቻዎች' : 'Rental Applications'} (${applications.length})`} />
          <Tab icon={<Article />} iconPosition="start" label={`${isAmharic ? 'ንቁ የኪራይ ውሎች' : 'Active Leases'} (${leases.length})`} />
          <Tab icon={<LocalOffer />} iconPosition="start" label={`${isAmharic ? 'የግዢ ጥያቄዎች' : 'Purchase Offers'} (${offers.length})`} />
          <Tab icon={<Build />} iconPosition="start" label={`${isAmharic ? 'ጥገና' : 'Maintenance'} (${maintenanceTickets.length})`} />
          <Tab icon={<Bookmark />} iconPosition="start" label={`${isAmharic ? 'የተቀመጡ ፍለጋዎች' : 'Saved Searches'} (${savedSearches.length})`} />
          <Tab icon={<Favorite />} iconPosition="start" label={`${isAmharic ? 'ተወዳጅ ቤቶች' : 'Favorites'} (${savedProperties.length})`} />
        </Tabs>
      </Card>

      {/* ─── Main Content Tabs ─── */}
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12 }}>
          <CircularProgress sx={{ color: isDark ? '#00ffff' : '#0284c7', mb: 2 }} />
          <Typography variant="body2" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>
            Loading your portal data...
          </Typography>
        </Box>
      ) : (
        <AnimatePresence mode="wait">
          {/* ════ TAB 0: APPOINTMENTS & VIEWINGS ════ */}
          {activeTab === 0 && (
            <motion.div key="tab-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                  Scheduled Property Viewings
                </Typography>
                <Button
                  component={Link}
                  href="/public/houses"
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: isDark ? '#00ffff' : '#0284c7',
                    color: isDark ? '#0a192f' : '#ffffff',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': { bgcolor: isDark ? '#38bdf8' : '#0369a1' }
                  }}
                >
                  Explore More Properties
                </Button>
              </Box>

              {appointments.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 3,
                    border: '1px dashed',
                    borderColor: isDark ? 'rgba(0, 255, 255, 0.2)' : '#cbd5e1',
                    bgcolor: isDark ? '#0f172a40' : '#f8fafc'
                  }}
                >
                  <CalendarMonth sx={{ fontSize: 52, color: isDark ? '#00ffff' : '#0284c7', mb: 1.5, opacity: 0.8 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                    No viewings scheduled yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#8892b0' : '#64748b', mb: 3, maxWidth: 450, mx: 'auto' }}>
                    Browse available residential and commercial properties to schedule private on-site or live video viewings.
                  </Typography>
                  <Button
                    component={Link}
                    href="/public/houses"
                    variant="contained"
                    sx={{
                      bgcolor: isDark ? '#00ffff' : '#0284c7',
                      color: isDark ? '#0a192f' : '#ffffff',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 2
                    }}
                  >
                    Find Properties Now
                  </Button>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {appointments.map((app) => {
                    const house = typeof app.houseId === 'object' && app.houseId ? app.houseId : null;
                    return (
                      <Grid item xs={12} md={6} key={app._id}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            bgcolor: isDark ? '#0f172a80' : '#ffffff',
                            border: isDark ? '1px solid rgba(0, 255, 255, 0.15)' : '1px solid #e2e8f0',
                            backdropFilter: isDark ? 'blur(10px)' : 'none',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: isDark ? '#00ffff' : '#0284c7',
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                              <Chip
                                size="small"
                                label={app.status}
                                color={app.status === 'CONFIRMED' ? 'success' : app.status === 'REQUESTED' ? 'warning' : 'default'}
                                sx={{ fontWeight: 700 }}
                              />
                              <Chip
                                size="small"
                                label={app.visitType === 'IN_PERSON' ? 'In-Person Visit' : 'Virtual Live Tour'}
                                sx={{
                                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                                  color: isDark ? '#ccd6f6' : '#334155',
                                  fontWeight: 600
                                }}
                              />
                            </Box>

                            <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a', mb: 1 }}>
                              {house ? (house.title || 'Property Viewing') : 'Property Viewing'}
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, my: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarMonth fontSize="small" sx={{ color: isDark ? '#00ffff' : '#0284c7' }} />
                                <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#1e293b' }}>
                                  Date: {new Date(app.visitDate).toLocaleDateString()} ({app.timeSlot})
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person fontSize="small" sx={{ color: isDark ? '#8892b0' : '#64748b' }} />
                                <Typography variant="body2" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>
                                  {isAmharic ? 'የሽያጭ ሰራተኛ፡' : 'Sales Representative:'} {app.hostId?.name || (isAmharic ? 'የተመደበ የሽያጭ ሰራተኛ' : 'Assigned Sales Staff')}
                                </Typography>
                              </Box>
                            </Box>

                            {app.notes && (
                              <Box sx={{ bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc', p: 1.5, borderRadius: 2, mb: 2 }}>
                                <Typography variant="body2" sx={{ color: isDark ? '#8892b0' : '#64748b', fontSize: 13 }}>
                                  Note: {app.notes}
                                </Typography>
                              </Box>
                            )}

                            {house && !house.isDeleted && (
                              <Button
                                component={Link}
                                href={`/public/houses/${house._id}`}
                                size="small"
                                variant="outlined"
                                fullWidth
                                sx={{
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  borderColor: isDark ? 'rgba(0, 255, 255, 0.3)' : '#cbd5e1',
                                  color: isDark ? '#00ffff' : '#0284c7'
                                }}
                              >
                                View Property Specifications
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </motion.div>
          )}

          {/* ════ TAB 1: RENTAL LEASE APPLICATIONS ════ */}
          {activeTab === 1 && (
            <motion.div key="tab-apps" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a', mb: 3 }}>
                My Rental Lease Applications
              </Typography>

              {applications.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 3,
                    border: '1px dashed',
                    borderColor: isDark ? 'rgba(0, 255, 255, 0.2)' : '#cbd5e1',
                    bgcolor: isDark ? '#0f172a40' : '#f8fafc'
                  }}
                >
                  <Description sx={{ fontSize: 56, color: '#8b5cf6', mb: 1.5, opacity: 0.8 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                    No rental applications submitted
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#8892b0' : '#64748b', mb: 3, maxWidth: 450, mx: 'auto' }}>
                    Browse our rental properties and click &quot;Apply for Rental Lease&quot; on any house to submit your tenancy application.
                  </Typography>
                  <Button
                    component={Link}
                    href="/public/houses"
                    variant="contained"
                    sx={{
                      bgcolor: isDark ? '#00ffff' : '#0284c7',
                      color: isDark ? '#0a192f' : '#ffffff',
                      borderRadius: 2,
                      fontWeight: 700,
                      textTransform: 'none',
                      '&:hover': { bgcolor: isDark ? '#38bdf8' : '#0369a1' }
                    }}
                  >
                    Browse Rental Houses
                  </Button>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {applications.map((app) => {
                    const house = typeof app.houseId === 'object' && app.houseId ? app.houseId : null;
                    return (
                      <Grid item xs={12} md={6} key={app._id}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            bgcolor: isDark ? '#0f172a80' : '#ffffff',
                            border: isDark ? '1px solid rgba(0, 255, 255, 0.15)' : '1px solid #e2e8f0',
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: isDark ? '#00ffff' : '#0284c7' }
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                                  {house ? (house.title || 'Rental Property') : 'Rental Property'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>
                                  Applied on: {new Date(app.created_at).toLocaleDateString()}
                                </Typography>
                              </Box>
                              <Chip
                                size="small"
                                label={
                                  app.status === 'APPROVED' ? 'Approved! Lease Ready' :
                                  app.status === 'PENDING' ? 'Under Review' :
                                  app.status === 'REJECTED' ? 'Declined' : app.status
                                }
                                color={
                                  app.status === 'APPROVED' ? 'success' :
                                  app.status === 'PENDING' ? 'warning' : 'error'
                                }
                                sx={{ fontWeight: 700 }}
                              />
                            </Box>

                            <Divider sx={{ my: 1.5, borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0' }} />

                            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                              <Grid item xs={6}>
                                <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>Move-In Date</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                                  {new Date(app.preferredMoveInDate).toLocaleDateString()}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>Stated Monthly Income</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#8b5cf6' }}>
                                  ETB {app.monthlyIncome?.toLocaleString()}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>Occupants</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                                  {app.numberOfOccupants} Person(s)
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>Occupation</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                                  {app.occupation}
                                </Typography>
                              </Grid>
                            </Grid>

                            {app.adminNotes && (
                              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#f0fdf4', mb: 2, borderLeft: '3px solid #10b981' }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#10b981' }}>Manager Feedback:</Typography>
                                <Typography variant="body2" sx={{ color: isDark ? '#ccd6f6' : '#334155' }}>{app.adminNotes}</Typography>
                              </Box>
                            )}

                            {app.status === 'APPROVED' ? (
                              <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                onClick={() => setActiveTab(2)}
                                startIcon={<Article />}
                                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                              >
                                Review & Sign Lease Contract
                              </Button>
                            ) : house && !house.isDeleted ? (
                              <Button
                                component={Link}
                                href={`/public/houses/${house._id}`}
                                variant="outlined"
                                size="small"
                                fullWidth
                                sx={{ textTransform: 'none', borderRadius: 2 }}
                              >
                                View Property Details
                              </Button>
                            ) : null}
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </motion.div>
          )}

          {/* ════ TAB 2: ACTIVE LEASES & RECEIPTS ════ */}
          {activeTab === 2 && (
            <motion.div key="tab-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a', mb: 3 }}>
                My Active Tenancy Agreements & Rent Payment Records
              </Typography>

              {leases.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 3,
                    border: '1px dashed',
                    borderColor: isDark ? 'rgba(0, 255, 255, 0.2)' : '#cbd5e1',
                    bgcolor: isDark ? '#0f172a40' : '#f8fafc'
                  }}
                >
                  <Article sx={{ fontSize: 52, color: '#10b981', mb: 1.5, opacity: 0.8 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                    No active rental lease agreements
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#8892b0' : '#64748b', mb: 2, maxWidth: 450, mx: 'auto' }}>
                    Once your tenancy application is approved by the property owner, your digital contract, rent schedules, and official receipts will be archived here.
                  </Typography>
                </Paper>
              ) : (
                <Stack spacing={3}>
                  {leases.map((lease) => (
                    <Card
                      key={lease._id}
                      sx={{
                        borderRadius: 3,
                        bgcolor: isDark ? '#0f172a80' : '#ffffff',
                        border: isDark ? '1px solid rgba(0, 255, 255, 0.15)' : '1px solid #e2e8f0',
                        backdropFilter: isDark ? 'blur(10px)' : 'none'
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                                Agreement #{lease.agreementNumber}
                              </Typography>
                              <Chip
                                size="small"
                                label={lease.status}
                                color={lease.status === 'ACTIVE' ? 'success' : 'warning'}
                                sx={{ fontWeight: 700 }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>
                              Property: {(typeof lease.houseId === 'object' && lease.houseId) ? (lease.houseId.title || 'Rental Unit') : 'Rental Unit'}
                            </Typography>
                          </Box>

                          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                            <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>Monthly Rent</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981' }}>
                              ETB {lease.rentAmount.toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2, borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0' }} />

                        {/* Dates & Deposit details */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>Lease Duration</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                              {new Date(lease.startDate).toLocaleDateString()} - {new Date(lease.endDate).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>Security Deposit</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                              ETB {lease.securityDeposit.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>Tenant Signature</Typography>
                            <Typography variant="body2" sx={{ color: lease.signedByTenant ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                              {lease.signedByTenant ? 'Digitally Signed ✓' : 'Signature Pending'}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Button
                          variant="contained"
                          onClick={() => setSelectedLease(lease)}
                          startIcon={<Receipt />}
                          sx={{
                            bgcolor: isDark ? '#00ffff' : '#0284c7',
                            color: isDark ? '#0a192f' : '#ffffff',
                            fontWeight: 700,
                            borderRadius: 2,
                            textTransform: 'none',
                            '&:hover': { bgcolor: isDark ? '#38bdf8' : '#0369a1' }
                          }}
                        >
                          View Contract, Rent Schedule & Official Receipts
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </motion.div>
          )}

          {/* ════ TAB 3: PRODUCT ORDERS, NEGOTIATIONS & PROGRESS ════ */}
          {activeTab === 3 && (
            <motion.div key="tab-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <div>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                    {isAmharic ? 'የእኔ ምርት ትዕዛዞች፣ ድርድር እና የቀጥታ ሂደት' : 'My Product Orders, Negotiations & Live Production Progress'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>
                    {isAmharic ? 'የ25% ቅድመ ክፍያ፣ የቀጥታ ምርት ሂደት ክትትል እና የ75% ርክክብ ክፍያ' : 'Track 25% advance deposits, live factory fabrication milestones, and 75% handover settlements.'}
                  </Typography>
                </div>
                <Button
                  component={Link}
                  href="/public/houses"
                  variant="outlined"
                  size="small"
                  startIcon={<Storefront />}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                >
                  {isAmharic ? 'ተጨማሪ ምርቶች ይዘዙ' : 'Order More Products'}
                </Button>
              </Box>

              {offers.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 3,
                    border: '1px dashed',
                    borderColor: isDark ? 'rgba(0, 255, 255, 0.2)' : '#cbd5e1',
                    bgcolor: isDark ? '#0f172a40' : '#f8fafc'
                  }}
                >
                  <LocalOffer sx={{ fontSize: 52, color: '#f59e0b', mb: 1.5, opacity: 0.8 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                    {isAmharic ? 'ምንም አይነት የትዕዛዝ ወይም የዋጋ ጥያቄ አልተገኘም' : 'No product orders or quotes submitted'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#8892b0' : '#64748b', mb: 2, maxWidth: 450, mx: 'auto' }}>
                    {isAmharic 
                      ? 'የግንባታ እቃዎችን ወይም የቤት እቃዎችን ከመረጡ በኋላ "ትዕዛዝ ያቅርቡ / ዋጋ ይደራደሩ" የሚለውን በመጫን በ25% ቅድመ ክፍያ ማዘዝ ይችላሉ።'
                      : 'Browse our catalog of certified construction materials and custom furniture. Submit your order with 25% advance deposit to begin fabrication.'}
                  </Typography>
                  <Button
                    component={Link}
                    href="/public/houses"
                    variant="contained"
                    sx={{
                      bgcolor: isDark ? '#00ffff' : '#0284c7',
                      color: isDark ? '#0a192f' : '#ffffff',
                      borderRadius: 2,
                      fontWeight: 700,
                      textTransform: 'none'
                    }}
                  >
                    {isAmharic ? 'ምርቶችን ያስሱ' : 'Browse Catalog'}
                  </Button>
                </Paper>
              ) : (
                <Stack spacing={3}>
                  {offers.map((offer) => {
                    const house = typeof offer.houseId === 'object' && offer.houseId ? offer.houseId : null;
                    const isPartial = offer.paymentPlan === 'PARTIAL';
                    const hasMilestones = offer.milestones && offer.milestones.length > 0;
                    const m1 = offer.milestones?.[0];
                    const m2 = offer.milestones?.[1];
                    const m1Paid = m1 && (m1.status === 'PAID' || m1.status === 'VERIFIED');
                    const m2Paid = m2 && (m2.status === 'PAID' || m2.status === 'VERIFIED');
                    const isFullyPaid = isPartial ? (m1Paid && m2Paid) : m1Paid;
                    const isFinished = offer.status === 'PRODUCT_FINISHED' || offer.status === 'READY_FOR_PICKUP';
                    const isTaken = offer.status === 'PRODUCT_TAKEN' || offer.status === 'COMPLETED_SALE';
                    const canConfirmTaken = (isFinished || offer.status === 'READY_FOR_PICKUP') && isFullyPaid && !isTaken;

                    return (
                      <Card
                        key={offer._id}
                        sx={{
                          borderRadius: 3,
                          bgcolor: isDark ? '#0f172a80' : '#ffffff',
                          border: isDark ? '1px solid rgba(0, 255, 255, 0.15)' : '1px solid #e2e8f0',
                          backdropFilter: isDark ? 'blur(10px)' : 'none',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Status bar top banner */}
                        {isTaken ? (
                          <Box sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', px: 3, py: 1, borderBottom: '1px solid #10b981', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircle sx={{ color: '#10b981', fontSize: 18 }} />
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#10b981' }}>
                              {isAmharic ? 'ምርቱ በተሳካ ሁኔታ ተረክቧል (የተጠናቀቀ)' : 'Product Successfully Received & Handover Confirmed ✓'}
                            </Typography>
                          </Box>
                        ) : isFinished ? (
                          <Box sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', px: 3, py: 1, borderBottom: '1px solid #0284c7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DoneAll sx={{ color: '#0284c7', fontSize: 18 }} />
                              <Typography variant="caption" sx={{ fontWeight: 800, color: isDark ? '#38bdf8' : '#0284c7' }}>
                                {isAmharic ? '🎉 ምርቱ ተጠናቆ ለርክክብ ዝግጁ ሆኗል!' : '🎉 Production Complete! Your product is inspected and ready for pickup.'}
                              </Typography>
                            </Box>
                            {isPartial && !m2Paid && (
                              <Typography variant="caption" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                                {isAmharic ? 'ቀሪውን 75% ክፍያ ፈጽመው ምርትዎን ይረከቡ' : 'Please settle the remaining 75% balance to complete pickup.'}
                              </Typography>
                            )}
                          </Box>
                        ) : null}

                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                                  {house?.title || (isAmharic ? 'የትዕዛዝ ጥያቄ' : 'Product Order')}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={`${offer.quantity || 1} Unit(s)`}
                                  sx={{ fontWeight: 700, bgcolor: isDark ? '#1e293b' : '#f1f5f9' }}
                                />
                                <Chip
                                  size="small"
                                  label={isPartial ? (isAmharic ? '25% ቅድመ ክፍያ ስልት' : '25% Partial Payment Plan') : (isAmharic ? '100% ሙሉ ክፍያ' : '100% Full Payment')}
                                  color={isPartial ? 'primary' : 'default'}
                                  sx={{ fontWeight: 700 }}
                                />
                                <Chip
                                  size="small"
                                  label={
                                    isTaken ? (isAmharic ? 'ተረክቧል ✓' : 'Product Taken ✓') :
                                    isFinished ? (isAmharic ? 'ምርቱ ተጠናቋል' : 'Product Finished') :
                                    offer.status === 'IN_PRODUCTION' ? (isAmharic ? 'በምርት ላይ' : 'In Production') :
                                    offer.status === 'ADVANCE_PAID' ? (isAmharic ? 'ቅድመ ክፍያ ተፈፅሟል' : 'Advance Paid') :
                                    offer.status === 'OFFER_ACCEPTED' || offer.status === 'PRICE_AGREED' ? (isAmharic ? 'ዋጋ ተስማምቷል' : 'Price Agreed') :
                                    offer.status === 'UNDER_NEGOTIATION' ? (isAmharic ? 'በድርድር ላይ' : 'Under Negotiation') :
                                    offer.status.replace(/_/g, ' ')
                                  }
                                  color={
                                    isTaken ? 'success' :
                                    isFinished ? 'success' :
                                    offer.status === 'IN_PRODUCTION' ? 'primary' :
                                    offer.status === 'ADVANCE_PAID' ? 'info' :
                                    offer.status === 'OFFER_ACCEPTED' ? 'success' : 'warning'
                                  }
                                  sx={{ fontWeight: 700 }}
                                />
                              </Box>
                              <Typography variant="body2" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>
                                {isAmharic ? 'ትዕዛዝ ቁጥር፡' : 'Order Ref:'} #{offer._id.slice(-8)} • {new Date(offer.createdAt || (offer as any).created_at).toLocaleDateString()}
                              </Typography>
                            </Box>

                            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                              <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>
                                {isAmharic ? 'ጠቅላላ የተስማሙበት ዋጋ' : 'Agreed Total Price'}
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981' }}>
                                ETB {offer.currentOfferAmount?.toLocaleString()}
                              </Typography>
                              {isPartial && (
                                <Typography variant="caption" sx={{ display: 'block', color: isDark ? '#38bdf8' : '#0284c7', fontWeight: 600 }}>
                                  25% Advance: ETB {(offer.advanceAmount || ((offer.currentOfferAmount || 0) * 0.25)).toLocaleString()} • 75% Final: ETB {(offer.finalAmount || ((offer.currentOfferAmount || 0) * 0.75)).toLocaleString()}
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          <Divider sx={{ my: 2, borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0' }} />

                          {/* ── LIVE PRODUCTION PROGRESS BAR ── */}
                          {(['ADVANCE_PAID', 'FULL_PAID', 'IN_PRODUCTION', 'QUALITY_CHECK', 'PRODUCT_FINISHED', 'READY_FOR_PICKUP', 'PRODUCT_TAKEN', 'COMPLETED_SALE'].includes(offer.status) || (offer.productionProgress || 0) > 0) && (
                            <Box sx={{ mb: 3, p: 2.2, borderRadius: 2.5, bgcolor: isDark ? '#0a192f' : '#f8fafc', border: `1px solid ${isDark ? '#233554' : '#e2e8f0'}` }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Engineering sx={{ color: isDark ? '#38bdf8' : '#0284c7', fontSize: 20 }} />
                                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                                    {isAmharic ? 'የቀጥታ ምርት ሂደት ክትትል' : 'Live Production Progress'}
                                  </Typography>
                                </Box>
                                <Chip
                                  size="small"
                                  label={
                                    offer.productionStage === 'MATERIALS_PREPARATION' ? (isAmharic ? 'የእቃ ዝግጅት' : 'Materials Preparation') :
                                    offer.productionStage === 'IN_PRODUCTION' ? (isAmharic ? 'በምርት ሂደት ላይ' : 'Fabrication & Assembly') :
                                    offer.productionStage === 'QUALITY_CHECK' ? (isAmharic ? 'የጥራት ፍተሻ' : 'Quality Inspection') :
                                    offer.productionStage === 'PRODUCT_FINISHED' ? (isAmharic ? 'ምርት ተጠናቋል' : 'Product Finished') :
                                    offer.productionStage === 'READY_FOR_PICKUP' ? (isAmharic ? 'ለርክክብ ዝግጁ' : 'Ready for Pickup') :
                                    offer.productionStage === 'PRODUCT_TAKEN' ? (isAmharic ? 'ተረክቧል ✓' : 'Product Taken ✓') :
                                    (isAmharic ? 'በሂደት ላይ' : 'In Progress')
                                  }
                                  sx={{ fontWeight: 800, bgcolor: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.1)', color: isDark ? '#38bdf8' : '#0284c7' }}
                                />
                              </Box>

                              {/* Visual Progress Bar */}
                              <Box sx={{ mb: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>
                                    {isAmharic ? 'የምርት ምዕራፍ ሂደት' : 'Fabrication Milestone'}
                                  </Typography>
                                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#10b981' }}>
                                    {offer.productionProgress || 0}%
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={offer.productionProgress || 0}
                                  sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
                                    '& .MuiLinearProgress-bar': {
                                      background: 'linear-gradient(90deg, #06b6d4, #10b981)',
                                      borderRadius: 5
                                    }
                                  }}
                                />
                              </Box>

                              {/* Production Notes from Staff */}
                              {offer.productionNotes && (
                                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(6, 182, 212, 0.08)' : '#f0fdf4', borderLeft: '3px solid #06b6d4' }}>
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#06b6d4', display: 'block', mb: 0.3 }}>
                                    {isAmharic ? 'ከቴክኒሻኑ የተሰጠ የሂደት ማስታወሻ፡' : 'Factory Production Notes:'}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: isDark ? '#ccd6f6' : '#334155' }}>
                                    {offer.productionNotes}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          )}

                          {/* Negotiation Chat Timeline */}
                          {offer.negotiationTimeline && offer.negotiationTimeline.length > 0 && (
                            <Box sx={{ mb: 2.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                                  {isAmharic ? 'የዋጋ ድርድር ሂደት' : 'Negotiation Timeline'}
                                </Typography>
                                {(offer.status === 'UNDER_NEGOTIATION' || offer.status === 'OFFER_SUBMITTED') && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => {
                                      setCounterOfferTarget(offer);
                                      setCounterAmount(String(offer.currentOfferAmount || ''));
                                      setCustomerCounterOpen(true);
                                    }}
                                    sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700, fontSize: 12 }}
                                  >
                                    {isAmharic ? 'የዋጋ ድርድር ሀሳብ ላክ' : 'Propose Counter-Offer'}
                                  </Button>
                                )}
                              </Box>
                              <Stack spacing={1} sx={{ mb: 1.5 }}>
                                {offer.negotiationTimeline.map((step, idx) => (
                                  <Box
                                    key={idx}
                                    sx={{
                                      p: 1.3,
                                      borderRadius: 2,
                                      bgcolor: step.senderRole === 'buyer'
                                        ? (isDark ? 'rgba(6, 182, 212, 0.12)' : 'rgba(6, 182, 212, 0.08)')
                                        : (isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)'),
                                      borderLeft: '4px solid',
                                      borderColor: step.senderRole === 'buyer' ? '#06b6d4' : '#10b981'
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'capitalize', color: isDark ? '#ccd6f6' : '#0f172a' }}>
                                        {step.senderRole === 'buyer' ? (isAmharic ? 'የእርስዎ ሀሳብ (ደንበኛ)' : 'You (Buyer)') : (isAmharic ? 'የሽያጭ ሰራተኛ (Sales Staff)' : 'Sales Staff')}: ETB {step.proposedAmount?.toLocaleString()}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>
                                        {new Date(step.timestamp).toLocaleDateString()}
                                      </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ mt: 0.5, color: isDark ? '#e2e8f0' : '#334155' }}>
                                      {step.message}
                                    </Typography>
                                  </Box>
                                ))}
                              </Stack>
                            </Box>
                          )}

                          {/* Milestones & Escrow Payments */}
                          {hasMilestones && (
                            <>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                                  {isPartial 
                                    ? (isAmharic ? 'የክፍያ ምዕራፎች (25% ቅድመ ክፍያ + 75% ርክክብ)' : 'Payment Milestones (25% Advance + 75% on Delivery)')
                                    : (isAmharic ? 'ሙሉ ክፍያ (100%)' : 'Full Payment (100% Upfront)')}
                                </Typography>
                                {isTaken && (
                                  <Chip
                                    size="small"
                                    color="success"
                                    label={isAmharic ? 'ትዕዛዙ ሙሉ በሙሉ ተጠናቋል ✓' : 'Order Fully Completed ✓'}
                                    sx={{ fontWeight: 800 }}
                                  />
                                )}
                              </Box>

                              <Grid container spacing={2}>
                                {offer.milestones.map((m: any, idx: number) => {
                                  const isPaid = m.status === 'PAID' || m.status === 'VERIFIED';
                                  const isUnderReview = m.status === 'UNDER_REVIEW';
                                  const isPending = m.status === 'PENDING';
                                  const canPay = isPending && offer.status !== 'OFFER_REJECTED' && offer.status !== 'CANCELLED';

                                  return (
                                    <Grid item xs={12} sm={isPartial ? 6 : 12} key={m._id || m.id || idx}>
                                      <Paper
                                        elevation={0}
                                        sx={{
                                          p: 2,
                                          bgcolor: isPaid
                                            ? (isDark ? 'rgba(16, 185, 129, 0.08)' : '#f0fdf4')
                                            : isUnderReview
                                            ? (isDark ? 'rgba(245, 158, 11, 0.08)' : '#fffbeb')
                                            : (isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc'),
                                          borderRadius: 2.5,
                                          border: `1.5px solid ${
                                            isPaid
                                              ? '#10b981'
                                              : isUnderReview
                                              ? '#f59e0b'
                                              : isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'
                                          }`,
                                          display: 'flex',
                                          flexDirection: 'column',
                                          justifyContent: 'space-between',
                                          height: '100%'
                                        }}
                                      >
                                        <Box>
                                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                            <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b', fontWeight: 600 }}>
                                              {m.title}
                                            </Typography>
                                            <Chip
                                              size="small"
                                              label={
                                                isPaid
                                                  ? (isAmharic ? 'ተከፍሏል ✓' : 'PAID ✓')
                                                  : isUnderReview
                                                  ? (isAmharic ? 'በግምገማ ላይ' : 'UNDER REVIEW')
                                                  : (isAmharic ? 'ይጠበቃል' : 'PENDING')
                                              }
                                              color={isPaid ? 'success' : isUnderReview ? 'warning' : 'default'}
                                              sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
                                            />
                                          </Box>

                                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981', mt: 0.5 }}>
                                            ETB {m.amount?.toLocaleString()}
                                          </Typography>

                                          <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b', display: 'block', mt: 0.5 }}>
                                            {isAmharic ? 'የሚከፈልበት ቀን፡' : 'Due Date:'} {new Date(m.dueDate).toLocaleDateString()}
                                          </Typography>

                                          {isUnderReview && (
                                            <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 600, display: 'block', mt: 0.5 }}>
                                              {isAmharic ? 'የማረጋገጫ ኮድ፡' : 'Tx Ref:'} {m.transactionReference || 'Pending'}
                                            </Typography>
                                          )}
                                        </Box>

                                        <Box sx={{ mt: 2 }}>
                                          {canPay && (
                                            <Button
                                              fullWidth
                                              size="small"
                                              variant="contained"
                                              startIcon={<PaymentIcon />}
                                              onClick={() => {
                                                setPayingOffer(offer);
                                                setPayingMilestone(m);
                                              }}
                                              sx={{
                                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                fontSize: 12,
                                                py: 0.7
                                              }}
                                            >
                                              {idx === 0 
                                                ? (isAmharic ? '25% ቅድመ ክፍያ ፈጽም' : 'Pay 25% Advance Deposit')
                                                : (isAmharic ? 'ቀሪ 75% ክፍያ ፈጽም' : 'Pay Remaining 75% Balance')}
                                            </Button>
                                          )}

                                          {isPaid && (
                                            <Button
                                              fullWidth
                                              size="small"
                                              variant="outlined"
                                              color="success"
                                              startIcon={<Receipt />}
                                              onClick={() => {
                                                setReceiptOffer(offer);
                                                setReceiptMilestone(m);
                                              }}
                                              sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                fontSize: 12,
                                                py: 0.7
                                              }}
                                            >
                                              {isAmharic ? 'ደረሰኝ ተመልከት' : 'View Official Receipt'}
                                            </Button>
                                          )}

                                          {isUnderReview && (
                                            <Button
                                              fullWidth
                                              size="small"
                                              disabled
                                              sx={{
                                                bgcolor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: '#f59e0b',
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                fontSize: 12,
                                                py: 0.7
                                              }}
                                            >
                                              {isAmharic ? 'የሽያጭ ሰራተኛው እያረጋገጠ ነው...' : 'Awaiting Sales Staff Approval...'}
                                            </Button>
                                          )}
                                        </Box>
                                      </Paper>
                                    </Grid>
                                  );
                                })}
                              </Grid>
                            </>
                          )}

                          {/* Final Product Handover Confirmation Button */}
                          {canConfirmTaken && (
                            <Box sx={{ mt: 3, p: 2, borderRadius: 2.5, bgcolor: 'rgba(16, 185, 129, 0.1)', border: '1.5px dashed #10b981', textAlign: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981', mb: 1 }}>
                                {isAmharic 
                                  ? 'ምርቱን ፈትሸው ተረክበዋል? ርክክቡን ለማረጋገጥ ከታች ያለውን ይጫኑ፡'
                                  : 'Have you inspected and taken the product? Confirm acceptance below:'}
                              </Typography>
                              <Button
                                variant="contained"
                                color="success"
                                size="large"
                                startIcon={<CheckCircleOutline />}
                                disabled={confirmingTakenId === offer._id}
                                onClick={() => handleConfirmProductTaken(offer._id)}
                                sx={{
                                  borderRadius: 2.5,
                                  fontWeight: 800,
                                  textTransform: 'none',
                                  px: 4,
                                  py: 1.2,
                                  background: 'linear-gradient(135deg, #10b981, #059669)'
                                }}
                              >
                                {confirmingTakenId === offer._id
                                  ? (isAmharic ? 'በማረጋገጥ ላይ...' : 'Confirming...')
                                  : (isAmharic ? 'ምርቱን መረከቤን አረጋግጣለሁ ✓' : 'Confirm Product Acceptance & Taken ✓')}
                              </Button>
                            </Box>
                          )}

                          {/* Confirmed Handover Date */}
                          {isTaken && offer.productTakenAt && (
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#10b981' }}>
                              <CheckCircle sx={{ fontSize: 16 }} />
                              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                {isAmharic ? 'የተረከበበት ቀን፡' : 'Handover confirmed on:'} {new Date(offer.productTakenAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              )}
            </motion.div>
          )}

          {/* ════ TAB 4: MAINTENANCE TICKETS ════ */}
          {activeTab === 4 && (
            <motion.div key="tab-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                  Maintenance & Repair Tickets
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setMaintenanceModalOpen(true)}
                  sx={{
                    bgcolor: isDark ? '#00ffff' : '#0284c7',
                    color: isDark ? '#0a192f' : '#ffffff',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': { bgcolor: isDark ? '#38bdf8' : '#0369a1' }
                  }}
                >
                  New Repair Ticket
                </Button>
              </Box>

              {maintenanceTickets.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 3,
                    border: '1px dashed',
                    borderColor: isDark ? 'rgba(0, 255, 255, 0.2)' : '#cbd5e1',
                    bgcolor: isDark ? '#0f172a40' : '#f8fafc'
                  }}
                >
                  <Build sx={{ fontSize: 52, color: '#ef4444', mb: 1.5, opacity: 0.8 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                    No maintenance tickets reported
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#8892b0' : '#64748b', mb: 3, maxWidth: 450, mx: 'auto' }}>
                    Encounter plumbing, electrical, HVAC, or security issues? Create a ticket to dispatch property maintenance professionals.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setMaintenanceModalOpen(true)}
                    sx={{
                      bgcolor: isDark ? '#00ffff' : '#0284c7',
                      color: isDark ? '#0a192f' : '#ffffff',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 2
                    }}
                  >
                    Submit Repair Ticket
                  </Button>
                </Paper>
              ) : (
                <Stack spacing={2}>
                  {maintenanceTickets.map((ticket) => (
                    <Paper
                      key={ticket._id}
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        bgcolor: isDark ? '#0f172a80' : '#ffffff',
                        border: isDark ? '1px solid rgba(0, 255, 255, 0.15)' : '1px solid #e2e8f0',
                        backdropFilter: isDark ? 'blur(10px)' : 'none'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip size="small" label={ticket.category} sx={{ fontWeight: 600 }} />
                          <Chip
                            size="small"
                            label={`${ticket.priority} Priority`}
                            color={ticket.priority === 'HIGH' || ticket.priority === 'EMERGENCY' ? 'error' : 'default'}
                          />
                        </Box>
                        <Chip
                          size="small"
                          label={ticket.status}
                          color={ticket.status === 'COMPLETED' ? 'success' : ticket.status === 'IN_PROGRESS' ? 'primary' : 'warning'}
                          sx={{ fontWeight: 700 }}
                        />
                      </Box>

                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                        {ticket.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDark ? '#8892b0' : '#64748b', mt: 0.5 }}>
                        {ticket.description}
                      </Typography>

                      {ticket.assignedTechnician && (
                        <Box sx={{ mt: 2, p: 1.5, bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc', borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>Assigned Technician:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                            {ticket.assignedTechnician} ({ticket.technicianContact || 'Contact Landlord'})
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  ))}
                </Stack>
              )}
            </motion.div>
          )}

          {/* ════ TAB 5: SAVED SEARCHES ════ */}
          {activeTab === 5 && (
            <motion.div key="tab-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a', mb: 3 }}>
                My Saved Searches & Property Alerts
              </Typography>

              {savedSearches.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 3,
                    border: '1px dashed',
                    borderColor: isDark ? 'rgba(0, 255, 255, 0.2)' : '#cbd5e1',
                    bgcolor: isDark ? '#0f172a40' : '#f8fafc'
                  }}
                >
                  <Bookmark sx={{ fontSize: 52, color: '#38bdf8', mb: 1.5, opacity: 0.8 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                    No saved searches yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#8892b0' : '#64748b', mb: 2, maxWidth: 450, mx: 'auto' }}>
                    When filtering houses, save your search preferences to get notified as soon as new properties hitting your criteria are listed.
                  </Typography>
                  <Button
                    component={Link}
                    href="/public/houses"
                    variant="contained"
                    sx={{
                      bgcolor: isDark ? '#00ffff' : '#0284c7',
                      color: isDark ? '#0a192f' : '#ffffff',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 2
                    }}
                  >
                    Browse Available Listings
                  </Button>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {savedSearches.map((search) => (
                    <Grid item xs={12} sm={6} key={search._id}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 3,
                          bgcolor: isDark ? '#0f172a80' : '#ffffff',
                          border: isDark ? '1px solid rgba(0, 255, 255, 0.15)' : '1px solid #e2e8f0',
                          backdropFilter: isDark ? 'blur(10px)' : 'none'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a' }}>
                            {search.name}
                          </Typography>
                          <IconButton size="small" onClick={() => handleDeleteSavedSearch(search._id)} sx={{ color: isDark ? '#8892b0' : '#64748b' }}>
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography variant="caption" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>
                          Frequency: {search.frequency} • Alerts: {search.notificationsEnabled ? 'Active' : 'Muted'}
                        </Typography>
                        <Button
                          component={Link}
                          href="/public/houses"
                          size="small"
                          variant="outlined"
                          fullWidth
                          sx={{
                            mt: 2,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderColor: isDark ? 'rgba(0, 255, 255, 0.3)' : '#cbd5e1',
                            color: isDark ? '#00ffff' : '#0284c7'
                          }}
                        >
                          Execute Search
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </motion.div>
          )}

          {/* ════ TAB 6: FAVORITES / WISHLIST ════ */}
          {activeTab === 6 && (
            <motion.div key="tab-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ccd6f6' : '#0f172a', mb: 3 }}>
                Saved & Favorited Properties
              </Typography>

              <Grid container spacing={3}>
                {savedProperties.map((house) => (
                  <Grid item xs={12} sm={6} md={4} key={house._id}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        bgcolor: isDark ? '#0f172a80' : '#ffffff',
                        border: isDark ? '1px solid rgba(0, 255, 255, 0.15)' : '1px solid #e2e8f0',
                        backdropFilter: isDark ? 'blur(10px)' : 'none',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: isDark ? '#00ffff' : '#0284c7',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 16, color: isDark ? '#ccd6f6' : '#0f172a', mb: 1 }}>
                          {house.title}
                        </Typography>
                        <Typography sx={{ color: isDark ? '#00ffff' : '#0891b2', fontWeight: 800, fontSize: 18, mb: 2 }}>
                          ETB {house.pricing.price.toLocaleString()}
                        </Typography>
                        <Button
                          component={Link}
                          href={`/public/houses/${house._id}`}
                          variant="contained"
                          size="small"
                          fullWidth
                          sx={{
                            bgcolor: isDark ? '#00ffff' : '#0284c7',
                            color: isDark ? '#0a192f' : '#ffffff',
                            fontWeight: 700,
                            borderRadius: 2,
                            textTransform: 'none',
                            '&:hover': { bgcolor: isDark ? '#38bdf8' : '#0369a1' }
                          }}
                        >
                          View Listing
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ─── Lease Agreement & Receipts Modal ─── */}
      {selectedLease && (
        <LeaseAgreementModal
          open={Boolean(selectedLease)}
          onClose={() => setSelectedLease(null)}
          lease={selectedLease}
          isTenant={true}
          onSuccess={() => fetchDashboardData(false)}
        />
      )}

      {/* ─── Purchase Milestone Payment Modal ─── */}
      {payingOffer && payingMilestone && (
        <PurchaseMilestonePaymentModal
          open={Boolean(payingMilestone)}
          onClose={() => {
            setPayingOffer(null);
            setPayingMilestone(null);
          }}
          offer={payingOffer}
          milestone={payingMilestone}
          onSuccess={() => fetchDashboardData(false)}
        />
      )}

      {/* ─── Purchase Official Sales Receipt Modal ─── */}
      {receiptOffer && receiptMilestone && (
        <PurchaseReceiptModal
          open={Boolean(receiptMilestone)}
          onClose={() => {
            setReceiptOffer(null);
            setReceiptMilestone(null);
          }}
          offer={receiptOffer}
          milestone={receiptMilestone}
        />
      )}

      {/* ─── Submit Maintenance Ticket Dialog ─── */}
      <Dialog
        open={maintenanceModalOpen}
        onClose={() => setMaintenanceModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: isDark ? '#0f172a' : '#ffffff',
            color: isDark ? '#ccd6f6' : '#0f172a',
            border: isDark ? '1px solid rgba(0, 255, 255, 0.2)' : 'none'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0' }}>
          Submit Maintenance Repair Ticket
        </DialogTitle>
        <form onSubmit={handleCreateMaintenance}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 3 }}>
            <FormControl fullWidth required>
              <InputLabel sx={{ color: isDark ? '#8892b0' : undefined }}>Repair Category</InputLabel>
              <Select
                value={newTicket.category}
                label="Repair Category"
                onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                sx={{
                  color: isDark ? '#ccd6f6' : undefined,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined }
                }}
              >
                <MenuItem value="PLUMBING">Plumbing (Leaks, Pipes, Faucets)</MenuItem>
                <MenuItem value="ELECTRICAL">Electrical & Lighting</MenuItem>
                <MenuItem value="HVAC_HEATING">Water Heater & HVAC</MenuItem>
                <MenuItem value="APPLIANCE">Kitchen Appliances</MenuItem>
                <MenuItem value="SECURITY_LOCKS">Doors, Windows & Key Locks</MenuItem>
                <MenuItem value="OTHER">Other Maintenance</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel sx={{ color: isDark ? '#8892b0' : undefined }}>Urgency Priority</InputLabel>
              <Select
                value={newTicket.priority}
                label="Urgency Priority"
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                sx={{
                  color: isDark ? '#ccd6f6' : undefined,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined }
                }}
              >
                <MenuItem value="LOW">Low (Cosmetic / Flexible)</MenuItem>
                <MenuItem value="MEDIUM">Medium (Normal priority)</MenuItem>
                <MenuItem value="HIGH">High (Urgent attention)</MenuItem>
                <MenuItem value="EMERGENCY">Emergency (Critical defect / site delivery issue)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Brief Issue Title"
              required
              fullWidth
              placeholder="e.g. Steel coating blemish, missing fastener hardware, or dimensional variance"
              value={newTicket.title}
              onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
              InputLabelProps={{ sx: { color: isDark ? '#8892b0' : undefined } }}
              InputProps={{
                sx: {
                  color: isDark ? '#ccd6f6' : undefined,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined }
                }
              }}
            />

            <TextField
              label="Detailed Description"
              multiline
              rows={4}
              required
              fullWidth
              placeholder="Describe what happened, where the issue is located, and convenient times for a technician to inspect..."
              value={newTicket.description}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              InputLabelProps={{ sx: { color: isDark ? '#8892b0' : undefined } }}
              InputProps={{
                sx: {
                  color: isDark ? '#ccd6f6' : undefined,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined }
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5, borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0', gap: 1 }}>
            <Button
              onClick={() => setMaintenanceModalOpen(false)}
              sx={{ color: isDark ? '#8892b0' : '#64748b', textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={ticketLoading}
              sx={{
                bgcolor: isDark ? '#00ffff' : '#0284c7',
                color: isDark ? '#0a192f' : '#ffffff',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': { bgcolor: isDark ? '#38bdf8' : '#0369a1' }
              }}
            >
              {ticketLoading ? <CircularProgress size={22} color="inherit" /> : 'Submit Repair Ticket'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ─── Customer Counter-Offer Dialog ─── */}
      <Dialog
        open={customerCounterOpen}
        onClose={() => setCustomerCounterOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: isDark ? '#0f172a' : '#ffffff',
            color: isDark ? '#ccd6f6' : '#0f172a',
            border: isDark ? '1px solid rgba(0, 255, 255, 0.2)' : 'none'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0' }}>
          {isAmharic ? 'የዋጋ ድርድር ሀሳብ ማቅረቢያ' : 'Submit Price Counter-Proposal'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 3 }}>
          <Typography variant="body2" sx={{ color: isDark ? '#8892b0' : '#64748b' }}>
            {isAmharic
              ? 'ከሽያጭ ሰራተኛው ጋር ለመደራደር የሚፈልጉትን አዲስ ዋጋ እና መልእክትዎን ያስገቡ።'
              : 'Propose an adjusted total offer amount to the Sales Staff for negotiation.'}
          </Typography>
          <TextField
            label={isAmharic ? 'የሚፈልጉት ጠቅላላ ዋጋ (ETB)' : 'Proposed Total Amount (ETB)'}
            type="number"
            required
            fullWidth
            value={counterAmount}
            onChange={(e) => setCounterAmount(e.target.value)}
            InputLabelProps={{ sx: { color: isDark ? '#8892b0' : undefined } }}
            InputProps={{
              sx: {
                color: isDark ? '#ccd6f6' : undefined,
                fontWeight: 700,
                fontSize: '1.1rem',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined }
              }
            }}
          />
          {counterOfferTarget && counterOfferTarget.paymentPlan === 'PARTIAL' && (
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(6, 182, 212, 0.08)' : '#f0fdf4' }}>
              <Typography variant="caption" sx={{ color: '#06b6d4', fontWeight: 700, display: 'block' }}>
                {isAmharic ? 'የ25% / 75% ምዕራፍ ስሌት፡' : '25% / 75% Milestone Breakdown:'}
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#ccd6f6' : '#334155' }}>
                Advance (25%): ETB {((Number(counterAmount) || 0) * 0.25).toLocaleString()} • Final (75%): ETB {((Number(counterAmount) || 0) * 0.75).toLocaleString()}
              </Typography>
            </Box>
          )}
          <TextField
            label={isAmharic ? 'የድርድር መልእክት / ማብራሪያ' : 'Negotiation Message / Note'}
            multiline
            rows={3}
            fullWidth
            placeholder={isAmharic ? 'ለምሳሌ፡ ለጅምላ ግዢ ዋጋ ቢቀነስልን...' : 'e.g. Requesting discount for bulk project delivery...'}
            value={counterMessage}
            onChange={(e) => setCounterMessage(e.target.value)}
            InputLabelProps={{ sx: { color: isDark ? '#8892b0' : undefined } }}
            InputProps={{
              sx: {
                color: isDark ? '#ccd6f6' : undefined,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : undefined }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0' }}>
          <Button
            onClick={() => setCustomerCounterOpen(false)}
            sx={{ color: isDark ? '#8892b0' : '#64748b', textTransform: 'none' }}
          >
            {isAmharic ? 'ሰርዝ' : 'Cancel'}
          </Button>
          <Button
            variant="contained"
            disabled={counterSubmitting || !counterAmount}
            onClick={handleSendCustomerCounter}
            sx={{
              bgcolor: isDark ? '#00ffff' : '#0284c7',
              color: isDark ? '#0a192f' : '#ffffff',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            {counterSubmitting ? <CircularProgress size={22} color="inherit" /> : (isAmharic ? 'ሀሳብ ላክ' : 'Send Counter-Proposal')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Feedback Notification Snackbar ─── */}
      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={5000}
        onClose={() => setSnackbar('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbar('')} sx={{ borderRadius: 2 }}>
          {snackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
}
