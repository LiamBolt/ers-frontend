import { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { UploadCloud, X, AlertCircle, FileText } from 'lucide-react'

const ACCEPTED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const FileUpload = forwardRef(function FileUpload(
  { label, required, error, onChange, value, ...props },
  ref
) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [internalError, setInternalError] = useState(null)
  const file = value // from react-hook-form

  useImperativeHandle(ref, () => ({
    openFileDialog: () => inputRef.current?.click(),
  }))

  const validateFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setInternalError('Please upload a PDF, DOC, or DOCX file.')
      return false
    }
    if (file.size > MAX_SIZE) {
      setInternalError('File is too large — maximum size is 5MB.')
      return false
    }
    setInternalError(null)
    return true
  }

  const handleFile = (file) => {
    if (validateFile(file)) {
      onChange(file)
    } else {
      onChange(null) // reject
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  const removeFile = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-ers-ink">
        {label}
        {required && <span className="text-ers-danger ml-0.5">*</span>}
      </label>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload CV file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors
          cursor-pointer
          ${dragOver ? 'border-ers-primary bg-ers-primary/5' : 'border-ers-line hover:border-ers-primary/50'}
          ${error || internalError ? 'border-ers-danger bg-ers-danger/5' : ''}
          bg-white/85
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleChange}
          {...props}
        />
        {file ? (
          <div className="flex items-center gap-3 text-sm">
            <FileText size={20} className="text-ers-primary" />
            <div className="text-left">
              <p className="font-medium text-ers-ink">{file.name}</p>
              <p className="text-xs text-ers-ink-soft">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeFile()
              }}
              className="p-1 rounded-full hover:bg-ers-ink/5 text-ers-ink-soft"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud size={28} className="text-ers-ink-soft mb-2" />
            <p className="text-sm font-medium text-ers-ink">
              Drag & drop your CV here, or <span className="text-ers-primary">browse</span>
            </p>
            <p className="text-xs text-ers-ink-soft mt-1">PDF, DOC, DOCX — max 5MB</p>
          </>
        )}
      </div>
      {(error || internalError) && (
        <p className="flex items-start gap-1 text-xs text-ers-danger animate-slide-down">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{error || internalError}</span>
        </p>
      )}
    </div>
  )
})

export default FileUpload