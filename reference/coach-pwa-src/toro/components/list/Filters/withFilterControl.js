import useFilterToggle from 'toro/hooks/useFilterToggle'

function withFilterControl(WrappedComponent) {
  return (props) => {
    const { handleFilterChange, clearFilters } = useFilterToggle()

    return (
      <WrappedComponent
        {...props}
        handleFilterChange={handleFilterChange}
        clearFilters={clearFilters}
      />
    )
  }
}

export default withFilterControl
