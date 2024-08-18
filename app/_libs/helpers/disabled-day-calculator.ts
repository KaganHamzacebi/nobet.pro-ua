export const getDisabledDays = (selectedDayIndexes: Set<number>, range: number, min = 1, max = 31) => {
  const disabledDays = new Set<number>();

  for (const selectedDayIndex of Array.from(selectedDayIndexes)) {
    for (let i = selectedDayIndex - range; i <= selectedDayIndex + range; i++) {
      if (i !== selectedDayIndex && i >= min && i <= max) {
        disabledDays.add(i);
      }
    }
  }

  return Array.from(disabledDays);
};

