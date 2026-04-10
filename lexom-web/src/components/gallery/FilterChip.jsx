import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../store/filterSlice';

const FilterChip = ({ category, value }) => {
  const dispatch = useDispatch();
  const activeFilters = useSelector((state) => state.filter.activeFilters);
  const isActive = activeFilters[category] === value;

  return (
    <button
      onClick={() => dispatch(setFilter({ category, value }))}
      className={`filter-chip ${isActive ? 'active' : ''}`}
    >
      {value}
    </button>
  );
};

export default FilterChip;
