import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TripPlan, BudgetStatus } from "@shared/schema";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  tripPlan: TripPlan | null;
  dynamicBudget: BudgetStatus; // Required, not nullable - modal should not open without it
}

export function CheckoutModal({ isOpen, onClose, onComplete, tripPlan, dynamicBudget }: CheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "1111 1111 1111 1111",
    cvv: "111",
    expiry: "12/25",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setShowSuccess(true);

    // Show success animation then complete
    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="modal-checkout">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Book Your Trip
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Trip Summary */}
              {tripPlan && (
                <Card className="p-4 bg-muted/50">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Destination</span>
                      <span className="font-semibold text-foreground">
                        {tripPlan.destination.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="font-semibold text-foreground">
                        {tripPlan.itinerary.totalDays} days
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-sm font-semibold text-foreground">Total</span>
                      <span 
                        className="text-xl font-bold text-primary"
                        data-testid="text-modal-total"
                      >
                        ${dynamicBudget.allocated.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Payment Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                    data-testid="input-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    placeholder="1111 1111 1111 1111"
                    required
                    data-testid="input-card-number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      type="text"
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                      placeholder="12/25"
                      required
                      data-testid="input-expiry"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                      placeholder="111"
                      required
                      data-testid="input-cvv"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isProcessing}
                  data-testid="button-cancel-checkout"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isProcessing}
                  data-testid="button-process-payment"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Process Payment
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                This is a demo. No real payment will be processed.
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="py-8 text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto"
              >
                <Check className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Payment Successful!
                </h3>
                <p className="text-muted-foreground">
                  Processing your booking confirmation...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
