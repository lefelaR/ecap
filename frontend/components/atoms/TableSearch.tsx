interface TableSearchProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TableSearch({
  id,
  value,
  onChange,
  placeholder = 'Search…',
  className = '',
}: TableSearchProps) {
  return (
    <div className={`table-search ${className}`.trim()}>
      <label className="visually-hidden" htmlFor={id}>
        Search table
      </label>
      <input
        id={id}
        type="search"
        className="form-control form-control-sm"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search table"
      />
    </div>
  );
}
