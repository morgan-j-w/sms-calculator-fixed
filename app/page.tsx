'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, TrendingDown, Sparkles } from 'lucide-react'

const tiers = [
  { min: 50, max: 9999, rate: 0.110, label: '50 - 9,999 SMS' },
  { min: 10000, max: 24999, rate: 0.095, label: '10,000 - 24,999 SMS' },
  { min: 25000, max: 49999, rate: 0.082, label: '25,000 - 49,999 SMS' },
  { min: 50000, max: 99999, rate: 0.070, label: '50,000 - 99,999 SMS' },
  { min: 100000, max: 249999, rate: 0.058, label: '100,000 - 249,999 SMS' },
  { min: 250000, max: Infinity, rate: 0.050, label: '250,000+ SMS' },
]

const sliderVolumes = [50, 10000, 25000, 50000, 100000, 250000]

export default function SMSPricingCalculator() {
  const [volume, setVolume] = useState(10000)
  const [sliderValue, setSliderValue] = useState([1])

  const getTier = (vol: number) => {
    for (const tier of tiers) {
      if (vol >= tier.min && vol <= tier.max) return tier
    }
    return tiers[0]
  }

  const getTierIndex = (vol: number) => {
    for (let i = 0; i < tiers.length; i++) {
      if (vol >= tiers[i].min && vol <= tiers[i].max) return i
    }
    return 0
  }

  const sliderIndexForVolume = (vol: number) => {
    let idx = 0
    for (let i = 0; i < sliderVolumes.length; i++) {
      if (vol >= sliderVolumes[i]) idx = i
    }
    return idx
  }

  const formatMoney = (n: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n)
  }

  const formatNumber = (n: number) => {
    return new Intl.NumberFormat('en-AU').format(n)
  }

  const formatRate = (n: number) => {
    return '$' + n.toFixed(3)
  }

  const tier = getTier(volume)
  const tierIndex = getTierIndex(volume)
  const total = volume * tier.rate
  const savings = volume * (tiers[0].rate - tier.rate)
  const nextTier = tierIndex < tiers.length - 1 ? tiers[tierIndex + 1] : null

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    const newVol = !Number.isFinite(val) || val < 50 ? 50 : val
    setVolume(newVol)
    setSliderValue([sliderIndexForVolume(newVol)])
  }

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value)
    setVolume(sliderVolumes[value[0]])
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-accent/50 border border-accent-foreground/10">
            <Sparkles className="w-4 h-4 text-accent-foreground" />
            <span className="text-sm font-semibold text-accent-foreground">
              Volume-Based Pricing
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
            SMS Pricing Calculator
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Choose a volume or type it in to see your rate and total cost instantly. The more you send, the more you save.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          {/* Main Calculator Card */}
          <Card className="lg:col-span-3 p-6 sm:p-8 bg-card border-border shadow-lg">
            <div className="space-y-8">
              {/* Volume Input */}
              <div>
                <label htmlFor="volumeInput" className="block text-sm font-bold text-foreground mb-3">
                  How many SMS are you planning to send?
                </label>
                <Input
                  id="volumeInput"
                  type="number"
                  min="50"
                  step="1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="text-2xl h-14 font-semibold"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Minimum purchase: 50 SMS credits
                </p>
              </div>

              {/* Slider */}
              <div>
                <Slider
                  value={sliderValue}
                  onValueChange={handleSliderChange}
                  max={5}
                  step={1}
                  className="mb-4"
                />
                <div className="grid grid-cols-6 gap-1 text-xs text-muted-foreground text-center">
                  <span>50</span>
                  <span>10k</span>
                  <span>25k</span>
                  <span>50k</span>
                  <span>100k</span>
                  <span>250k+</span>
                </div>
              </div>

              {/* Current Tier Badge */}
              <div>
                <Badge variant="secondary" className="text-base py-2 px-4 font-bold bg-accent text-accent-foreground">
                  {tier.label}
                </Badge>
              </div>

              {/* Next Tier Tip */}
              {nextTier ? (
                <Card className="p-4 bg-highlight-soft border-primary/20">
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-foreground leading-relaxed">
                      <span>Add </span>
                      <strong className="font-bold">{formatNumber(nextTier.min - volume)}</strong>
                      <span> more SMS to reach </span>
                      <strong className="font-bold">{formatNumber(nextTier.min)}</strong>
                      <span> and reduce your rate to </span>
                      <strong className="font-bold">{formatRate(nextTier.rate)}</strong>
                      <span>. At that level, you would save </span>
                      <strong className="font-bold">
                        {formatMoney((nextTier.min * tier.rate) - (nextTier.min * nextTier.rate))}
                      </strong>
                      <span> compared with buying the same volume at your current rate.</span>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-4 bg-success-soft border-success/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground leading-relaxed">
                      <span>Great news — this volume already qualifies for your best published rate of </span>
                      <strong className="font-bold">{formatRate(tier.rate)}</strong>
                      <span> per SMS.</span>
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="lg:col-span-2 space-y-4 self-start">
            <Card className="p-6 bg-card border-border shadow-lg">
              <div className="text-sm font-semibold text-muted-foreground mb-2">
                Your rate
              </div>
              <div className="text-4xl font-bold text-primary">
                {formatRate(tier.rate)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">per SMS</div>
            </Card>

            <Card className="p-6 bg-card border-border shadow-lg">
              <div className="text-sm font-semibold text-muted-foreground mb-2">
                Estimated total
              </div>
              <div className="text-4xl font-bold text-foreground">
                {formatMoney(total)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                for {formatNumber(volume)} SMS
              </div>
            </Card>

            <Card className="p-6 bg-success-soft border-success/30 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-success" />
                <div className="text-sm font-semibold text-success">
                  Savings vs base tier
                </div>
              </div>
              <div className="text-4xl font-bold text-success">
                {formatMoney(savings)}
              </div>
              <div className="text-sm text-success/80 mt-1">
                saved compared to {formatRate(tiers[0].rate)} rate
              </div>
            </Card>
          </div>
        </div>

        {/* Pricing Table */}
        <Card className="p-6 sm:p-8 bg-card border-border shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Volume Pricing Tiers
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Purchase Volume
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Price per SMS
                  </th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((t, idx) => {
                  const range =
                    t.max === Infinity
                      ? `${formatNumber(t.min)}+`
                      : `${formatNumber(t.min)} - ${formatNumber(t.max)}`
                  const isActive = t.min === tier.min
                  return (
                    <tr
                      key={idx}
                      className={`border-b border-border last:border-0 transition-colors ${
                        isActive ? 'bg-accent/30' : 'hover:bg-muted/50'
                      }`}
                    >
                      <td className={`py-4 px-4 ${isActive ? 'font-bold text-foreground' : 'text-foreground'}`}>
                        {range}
                      </td>
                      <td className={`py-4 px-4 ${isActive ? 'font-bold text-primary' : 'text-foreground'}`}>
                        {formatRate(t.rate)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Type any exact volume in the input box above for a precise calculation. Prices shown in AUD.
          </p>
        </Card>
      </div>
    </div>
  )
}
