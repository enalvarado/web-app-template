import { CSSProperties, useState } from 'react'
import { ActionTrigger, FormConfig } from '../types/config'
import { FormProvider, useFormValues } from '../context/FormContext'
import { useLocale } from '../context/LocaleContext'
import { resolveLocalized, uiText } from '../lib/i18n'
import { screenBackgroundTint } from '../lib/fieldStyle'
import ProgressIndicator from '../components/ProgressIndicator'
import NavButtons from '../components/NavButtons'
import ScreenActions from '../components/ScreenActions'
import LanguageToggle from '../components/LanguageToggle'
import ScreenRenderer from './ScreenRenderer'
import ReviewScreen from './ReviewScreen'
import { submitForm } from '../lib/api'

interface Props {
  config: FormConfig
}

export default function FormApp({ config }: Props) {
  return (
    <FormProvider formId={config.id}>
      <FormFlow config={config} />
    </FormProvider>
  )
}

function FormFlow({ config }: Props) {
  const { values, reset } = useFormValues()
  const { locale } = useLocale()
  const includeReview = config.includeReviewScreen ?? false
  const totalSteps = config.screens.length + (includeReview ? 1 : 0)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const isReviewStep = includeReview && step === config.screens.length
  const isLastScreen = step === config.screens.length - 1 && !includeReview

  const doSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await submitForm(config.id, values)
      reset()
      setSubmitted(true)
    } catch {
      setSubmitError(uiText(locale, 'submitError'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = async () => {
    if (isReviewStep || isLastScreen) {
      await doSubmit()
      return
    }
    setStep((s) => s + 1)
  }

  const handleBack = () => setStep((s) => Math.max(0, s - 1))

  const handleReset = () => {
    reset()
    setSubmitError(null)
    setStep(0)
  }

  const handleGoto = (targetScreenId?: string) => {
    const idx = config.screens.findIndex((s) => s.id === targetScreenId)
    if (idx !== -1) setStep(idx)
  }

  const handleAction = (action: ActionTrigger) => {
    switch (action.action) {
      case 'back':
        handleBack()
        return
      case 'submit':
        void doSubmit()
        return
      case 'reset':
        handleReset()
        return
      case 'goto':
        handleGoto(action.targetScreenId)
        return
      case 'next':
        void handleNext()
        return
      case 'none':
      default:
        return
    }
  }

  // The active screen's own background tint overrides the form-wide wallpaper for that screen
  // only — review/submitted have no single screen, so they always fall back to the wallpaper.
  const currentScreen = !submitted && !isReviewStep ? config.screens[step] : undefined
  const screenTint = screenBackgroundTint(currentScreen?.background)
  const wallpaperStyle: CSSProperties = screenTint
    ? { backgroundColor: screenTint }
    : config.backgroundImageUrl
      ? {
          backgroundImage: `url("${config.backgroundImageUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : {}

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto" style={wallpaperStyle}>
        <FormTitleBar config={config} />
        <div className="p-8 text-center">
          <h2 className="text-xl font-heading font-semibold text-morado mb-2">{uiText(locale, 'thankYou')}</h2>
          <p className="font-body text-gris">{uiText(locale, 'submissionReceived')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto" style={wallpaperStyle}>
      <FormTitleBar config={config} />
      <div className="p-4 sm:p-8">
        <ProgressIndicator current={step + 1} total={totalSteps} />
        {isReviewStep ? (
          <ReviewScreen config={config} />
        ) : (
          <ScreenRenderer screen={config.screens[step]} formId={config.id} onAction={handleAction} />
        )}
        {submitError && <p className="text-rosado-deep font-body text-sm mt-4">{submitError}</p>}
        {!isReviewStep && config.screens[step].actions?.length ? (
          <ScreenActions actions={config.screens[step].actions ?? []} onAction={handleAction} />
        ) : null}
        <NavButtons
          onBack={handleBack}
          onNext={handleNext}
          backDisabled={step === 0}
          nextDisabled={submitting}
          backLabel={uiText(locale, 'back')}
          nextLabel={
            isReviewStep || isLastScreen
              ? submitting
                ? uiText(locale, 'submitting')
                : uiText(locale, 'submit')
              : uiText(locale, 'next')
          }
        />
      </div>
    </div>
  )
}

function FormTitleBar({ config }: { config: FormConfig }) {
  const { locale } = useLocale()
  const size = config.headerLogoSize || 22
  const logo = config.headerLogoUrl ? (
    <img
      src={config.headerLogoUrl}
      alt=""
      style={{ height: size, maxWidth: size * 2.6 }}
      className="rounded object-contain flex-shrink-0"
    />
  ) : null
  const titleText = (
    <h1 className="text-center text-base sm:text-lg font-heading font-bold uppercase tracking-wide text-white truncate">
      {resolveLocalized(config.title, locale)}
    </h1>
  )
  return (
    <div className="bg-morado py-3 px-4 sm:px-8 flex items-center justify-between gap-3">
      <span className="w-[52px] flex-shrink-0" aria-hidden />
      <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
        {config.headerLogoPosition === 'right' ? (
          <>
            {titleText}
            {logo}
          </>
        ) : (
          <>
            {logo}
            {titleText}
          </>
        )}
      </div>
      <LanguageToggle />
    </div>
  )
}
