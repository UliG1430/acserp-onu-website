const FileUploadControl = ({ id, accept = "image/*", multiple = false, onChange, buttonText = "Cambiar archivo", currentText, helpText, isUploading }) => (
  <div className="mt-1">
    <input id={id} type="file" accept={accept} multiple={multiple} onChange={onChange} className="sr-only" />
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor={id} className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
        {buttonText}
      </label>
      {currentText && <span className="min-w-0 break-words text-sm text-gray-600">{currentText}</span>}
    </div>
    {helpText && <span className="mt-1 block text-xs text-gray-500">{helpText}</span>}
    {isUploading && <span className="mt-1 block text-xs text-blue-700">Subiendo...</span>}
  </div>
);

export default FileUploadControl;
