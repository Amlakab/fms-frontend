'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import {
  LocalOffer,
  Close,
  Shield,
  AccountBalance,
  ReceiptLong,
  CheckCircleOutline,
  PrecisionManufacturing,
  Assignment,
  Schedule
} from '@mui/icons-material';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/language-context';
import api from '@/app/utils/api';
import { House } from '@/types/houses';

interface PurchaseOfferModalProps {
  open: boolean;
  onClose: () => void;
  house: House;
  onSuccess?: () => void;
}

export default function PurchaseOfferModal({
  open,
  onClose,
  house,
  onSuccess
}: PurchaseOfferModalProps) {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const isDark = theme === 'dark';

  const baseUnitPrice = house.saleTerms?.askingPrice || house.pricing.price || 0;
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(baseUnitPrice);
  const [paymentPlan, setPaymentPlan] = useState<'PARTIAL' | 'FULL'>('PARTIAL');
  const [financingType, setFinancingType] = useState<'CASH' | 'BANK_MORTGAGE' | 'INSTALLMENT_PLAN' | 'OTHER'>('CASH');
  const [proposedClosingDate, setProposedClosingDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Total amount and milestones breakdown
  const totalAmount = unitPrice * quantity;
  const advanceAmount = paymentPlan === 'PARTIAL' ? Math.round(totalAmount * 0.25) : totalAmount;
  const remainingAmount = paymentPlan === 'PARTIAL' ? totalAmount - advanceAmount : 0;

  const diffFromCatalog = baseUnitPrice > 0 ? unitPrice - baseUnitPrice : 0;
  const percentageDiff = baseUnitPrice > 0 ? ((diffFromCatalog / baseUnitPrice) * 100).toFixed(1) : '0';

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: isDark ? '#0a192f' : '#ffffff',
      color: isDark ? '#f1f5f9' : '#0f172a',
      borderRadius: '10px',
      '& fieldset': { borderColor: isDark ? '#233554' : '#cbd5e1' },
      '&:hover fieldset': { borderColor: '#10b981' },
      '&.Mui-focused fieldset': { borderColor: '#10b981' }
    },
    '& .MuiInputLabel-root': { color: isDark ? '#94a3b8' : '#64748b' },
    '& .MuiFormHelperText-root': { color: isDark ? '#94a3b8' : '#64748b' }
  };

  const selectStyle = {
    backgroundColor: isDark ? '#0a192f' : '#ffffff',
    color: isDark ? '#f1f5f9' : '#0f172a',
    borderRadius: '10px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: isDark ? '#233554' : '#cbd5e1' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
    '& .MuiSvgIcon-root': { color: isDark ? '#94a3b8' : '#64748b' }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (unitPrice <= 0 || totalAmount <= 0) {
      setError(language === 'am' ? 'የቀረበው ዋጋ ከዜሮ መብለጥ አለበት' : 'Order amount must be greater than zero');
      return;
    }
    if (quantity <= 0) {
      setError(language === 'am' ? 'ብዛት ቢያንስ 1 መሆን አለበት' : 'Quantity must be at least 1');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await api.post('/workflows/offers', {
        houseId: house._id,
        offerAmount: totalAmount,
        quantity,
        paymentPlan,
        advanceAmount,
        finalAmount: remainingAmount,
        earnestDepositAmount: advanceAmount,
        proposedClosingDate: proposedClosingDate || undefined,
        financingType,
        message: message || `Order requested for ${quantity} unit(s) under ${paymentPlan === 'PARTIAL' ? '25% Partial Payment' : '100% Full Payment'} plan.`,
        productDetails: {
          title: house.title,
          sku: (house as any).productAttributes?.sku,
          unit: (house as any).productAttributes?.unit || 'Piece',
          pricePerUnit: unitPrice,
          category: house.propertyType
        },
        contingencies: [
          'MAT Engineering Quality Inspection Protocol',
          'Workshop Finishing Verification',
          'Standard Delivery / Collection Handover'
        ]
      });

      setSuccess(
        language === 'am'
          ? 'የትዕዛዝ እና የዋጋ ድርድር ጥያቄው ለማት ኢንጂነሪንግ የሽያጭ ሰራተኞች ተልኳል!'
          : 'Order request submitted to MAT Engineering & Trading Sales Staff!'
      );

      setTimeout(() => {
        onSuccess?.();
        onClose();
        setSuccess('');
      }, 1800);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        (language === 'am'
          ? 'የትዕዛዝ ጥያቄውን መላክ አልተቻለም። እባክዎ መግባትዎን ያረጋግጡ።'
          : 'Failed to submit order request. Please ensure you are logged in.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: isDark ? '#112240' : '#ffffff',
          border: isDark ? '1px solid #233554' : '1px solid #e2e8f0',
          color: isDark ? '#f1f5f9' : '#0f172a',
          backgroundImage: 'none'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, borderBottom: isDark ? '1px solid #233554' : '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PrecisionManufacturing sx={{ color: '#10b981', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a' }}>
              {language === 'am' ? 'የትዕዛዝ እና የዋጋ ድርድር ጥያቄ' : 'Place Order & Negotiate Price'}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              MAT Engineering & Trading PLC • {house.title}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 3 }}>
          {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ borderRadius: 2 }}>{success}</Alert>}

          {/* Product Header Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: isDark ? '#0a192f' : '#f8fafc',
              border: isDark ? '1px solid #233554' : '1px solid #e2e8f0'
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', mb: 0.5 }}>
              {house.title}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {language === 'am' ? 'ካታሎግ የመነሻ ዋጋ' : 'Catalog Base Price'}: ETB {baseUnitPrice.toLocaleString()}
              </Typography>
              <Chip
                label={house.propertyType.replace(/_/g, ' ')}
                size="small"
                sx={{ bgcolor: '#10b98118', color: '#10b981', fontWeight: 700, fontSize: 11 }}
              />
            </Box>
          </Paper>

          {/* Quantity & Proposed Unit Price */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' }, gap: 2 }}>
            <TextField
              label={language === 'am' ? 'ብዛት' : 'Quantity'}
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              required
              inputProps={{ min: 1 }}
              sx={textFieldStyle}
            />
            <TextField
              label={language === 'am' ? 'የቀረበ የአንዱ ዋጋ (ETB)' : 'Proposed Unit Price (ETB)'}
              type="number"
              fullWidth
              value={unitPrice}
              onChange={(e) => setUnitPrice(Math.max(0, Number(e.target.value)))}
              required
              sx={textFieldStyle}
              helperText={
                diffFromCatalog === 0
                  ? (language === 'am' ? 'የካታሎግ ሙሉ ዋጋ' : 'Offering standard catalog price')
                  : diffFromCatalog > 0
                  ? `+${percentageDiff}% ${language === 'am' ? 'ከካታሎግ በላይ' : 'above catalog'}`
                  : `${percentageDiff}% ${language === 'am' ? 'የድርድር ቅናሽ ጥያቄ' : 'negotiated discount request'}`
              }
            />
          </Box>

          {/* Payment Option Selection */}
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? '#0a192f' : '#f8fafc', border: isDark ? '1px solid #233554' : '1px solid #e2e8f0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: isDark ? '#f1f5f9' : '#0f172a' }}>
              {language === 'am' ? 'የክፍያ አማራጭ ይምረጡ' : 'Select Payment Option'}
            </Typography>

            <RadioGroup
              value={paymentPlan}
              onChange={(e) => setPaymentPlan(e.target.value as 'PARTIAL' | 'FULL')}
            >
              <Paper
                elevation={0}
                onClick={() => setPaymentPlan('PARTIAL')}
                sx={{
                  p: 1.5,
                  mb: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: `2px solid ${paymentPlan === 'PARTIAL' ? '#10b981' : isDark ? '#233554' : '#e2e8f0'}`,
                  bgcolor: paymentPlan === 'PARTIAL' ? (isDark ? '#10b98115' : '#10b9810a') : 'transparent'
                }}
              >
                <FormControlLabel
                  value="PARTIAL"
                  control={<Radio sx={{ color: '#10b981', '&.Mui-checked': { color: '#10b981' } }} />}
                  label={
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a' }}>
                          {language === 'am' ? 'ከፊል ክፍያ (25% ቅድመ ክፍያ + 75% ሲጠናቀቅ)' : 'Partial Payment (25% Advance + 75% on Completion)'}
                        </Typography>
                        <Chip label="Recommended" size="small" color="success" sx={{ height: 20, fontSize: 10, fontWeight: 700 }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b', display: 'block', mt: 0.3 }}>
                        {language === 'am'
                          ? 'ዋጋው ሲስማማ 25% ይከፍላሉ፤ ምርቱ ተሰርቶ ሲጠናቀቅና ሲረከቡ ቀሪውን 75% ይከፍላሉ።'
                          : 'Pay 25% upon price agreement to start production; pay remaining 75% when product is finished and taken.'}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>

              <Paper
                elevation={0}
                onClick={() => setPaymentPlan('FULL')}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: `2px solid ${paymentPlan === 'FULL' ? '#10b981' : isDark ? '#233554' : '#e2e8f0'}`,
                  bgcolor: paymentPlan === 'FULL' ? (isDark ? '#10b98115' : '#10b9810a') : 'transparent'
                }}
              >
                <FormControlLabel
                  value="FULL"
                  control={<Radio sx={{ color: '#10b981', '&.Mui-checked': { color: '#10b981' } }} />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a' }}>
                        {language === 'am' ? 'ሙሉ ክፍያ (100% ሙሉ)' : 'Full Payment (100% Upfront)'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b', display: 'block', mt: 0.3 }}>
                        {language === 'am'
                          ? 'ዋጋው ከተስማማ በኋላ ጠቅላላውን 100% ሙሉ ክፍያ በአንድ ጊዜ ይፈጽማሉ።'
                          : 'Pay the full agreed amount upfront for expedited dispatch or collection.'}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>
            </RadioGroup>
          </Box>

          {/* Payment Milestone Structure Box */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: isDark ? '#0a192f' : '#f8fafc',
              border: isDark ? '1px solid #233554' : '1px solid #e2e8f0'
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, color: isDark ? '#f1f5f9' : '#0f172a' }}>
              <ReceiptLong sx={{ color: '#10b981', fontSize: 20 }} />
              {language === 'am' ? 'የክፍያ እና የምርት ሂደት መርሃ-ግብር' : 'Payment & Production Schedule'}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8, borderBottom: `1px dashed ${isDark ? '#233554' : '#cbd5e1'}` }}>
              <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {language === 'am' ? 'ጠቅላላ የትዕዛዝ ዋጋ (' : 'Total Order Amount ('}{quantity} {language === 'am' ? 'ፍሬ):' : 'unit(s)): '}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a' }}>
                ETB {totalAmount.toLocaleString()}
              </Typography>
            </Box>

            {paymentPlan === 'PARTIAL' ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8, borderBottom: `1px dashed ${isDark ? '#233554' : '#cbd5e1'}` }}>
                  <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                    {language === 'am' ? '1. የቅድመ ክፍያ (25% - ስምምነት ሲደረግ):' : '1. Advance Deposit (25% upon agreement):'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#10b981' }}>
                    ETB {advanceAmount.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                  <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                    {language === 'am' ? '2. ቀሪ ክፍያ (75% - ምርቱ ተጠናቆ ሲረከቡ):' : '2. Final Balance (75% when product is finished):'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#38bdf8' }}>
                    ETB {remainingAmount.toLocaleString()}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                  {language === 'am' ? '1. ሙሉ ክፍያ (100% - ስምምነት ሲደረግ):' : '1. Full Upfront Payment (100% upon agreement):'}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#10b981' }}>
                  ETB {totalAmount.toLocaleString()}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Financing Method & Delivery Date */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth required sx={selectStyle}>
              <InputLabel sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {language === 'am' ? 'የክፍያ ዘዴ' : 'Payment Method'}
              </InputLabel>
              <Select
                value={financingType}
                label={language === 'am' ? 'የክፍያ ዘዴ' : 'Payment Method'}
                onChange={(e) => setFinancingType(e.target.value as any)}
              >
                <MenuItem value="CASH">{language === 'am' ? 'የኢትዮጵያ ንግድ ባንክ (CBE Transfer)' : 'CBE Bank Transfer'}</MenuItem>
                <MenuItem value="BANK_MORTGAGE">{language === 'am' ? 'ቴሌብር (TeleBirr Mobile)' : 'TeleBirr Mobile Pay'}</MenuItem>
                <MenuItem value="INSTALLMENT_PLAN">{language === 'am' ? 'በጥሬ ገንዘብ / በፋብሪካው' : 'Cash at MAT Showroom'}</MenuItem>
                <MenuItem value="OTHER">{language === 'am' ? 'የድርጅት ቼክ / PO' : 'Corporate Check / PO'}</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label={language === 'am' ? 'የሚፈለግበት የመረከቢያ ቀን' : 'Desired Delivery Date'}
              type="date"
              fullWidth
              value={proposedClosingDate}
              onChange={(e) => setProposedClosingDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={textFieldStyle}
            />
          </Box>

          {/* Negotiation Message to Sales Staff */}
          <TextField
            label={language === 'am' ? 'ለሽያጭ ሰራተኞች የሚላክ ማስታወሻ ወይም ዝርዝር ጥያቄ' : 'Message to MAT Sales Staff'}
            multiline
            rows={2.5}
            fullWidth
            placeholder={
              language === 'am'
                ? 'ለምሳሌ፡ ለግንባታ ፕሮጀክት የምንፈልገው ስለሆነ ጥራቱ እና የፍተሻ ሰርተፊኬቱ አብሮ እንዲዘጋጅ እንፈልጋለን...'
                : 'e.g. Requesting Grade 60 mill test certificate and coordination for site delivery in Addis Ababa...'
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={textFieldStyle}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Shield sx={{ color: '#06b6d4', fontSize: 18 }} />
            <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              {language === 'am'
                ? 'የሽያጭ ሰራተኛው ዋጋውን ካረጋገጠ በኋላ ክፍያውን ይፈጽማሉ፤ የምርቱን ሂደትም ደረጃ በደረጃ መከታተል ይችላሉ።'
                : 'Once MAT Sales Staff and customer agree on price, payment proceeds and live fabrication progress is tracked until pickup.'}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: isDark ? '1px solid #233554' : '1px solid #e2e8f0', display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1.5 }}>
          <Button
            onClick={onClose}
            sx={{
              color: isDark ? '#94a3b8' : '#64748b',
              width: { xs: '100%', sm: 'auto' },
              textTransform: 'none'
            }}
          >
            {t('action.cancel', 'Cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#10b981',
              '&:hover': { bgcolor: '#059669' },
              borderRadius: '10px',
              px: 3,
              py: 1.2,
              fontWeight: 700,
              textTransform: 'none',
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : (language === 'am' ? 'የትዕዛዝ ጥያቄውን ላክ' : 'Submit Order Request')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
