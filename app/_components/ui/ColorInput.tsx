'use client';

import React, { FC, useState } from 'react';
import { ColorPicker, ColorSwatch, type ColorSwatchProps, ElementProps } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';

interface IColorInputProps extends ColorSwatchProps, ElementProps<'button', keyof ColorSwatchProps> {
}

export const ColorInput: FC<IColorInputProps> = ({ color }) => {
  const ref = useClickOutside(() => setIsPickerVisible(false));
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [value, setValue] = useState(color);

  const openPicker = () => {
    setIsPickerVisible(true);
  };

  return (
    <div className="relative overflow-visible">
      <ColorSwatch color={value}
                   size="25"
                   component="button"
                   onClick={openPicker}
      />
      {
        isPickerVisible &&
        <ColorPicker ref={ref}
                     className="absolute whitespace-nowrap"
                     onChangeEnd={setValue}
        />
      }
    </div>
  );
};