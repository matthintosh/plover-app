import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { DiagnosisForm, DiagnosisFormProps } from '../DiagnosisForm';

const renderDiagnosisForm = (overrideProps: Partial<DiagnosisFormProps> = {}) => {
  const props: DiagnosisFormProps = {
    loading: false,
    error: null,
    onSubmit: jest.fn(),
    initialValues: {
      type: 'gingivitis',
      grade: null,
      stage: null,
    },
    ...overrideProps,
  };

  const result = render(<DiagnosisForm {...props} />);

  return {
    ...result,
    props,
  };
};

describe('DiagnosisForm', () => {
  it('submits gingivitis diagnosis without grade and stage', async () => {
    const { getByText, props } = renderDiagnosisForm();

    fireEvent.press(getByText(/save diagnosis/i));

    await waitFor(() => {
      expect(props.onSubmit).toHaveBeenCalledWith({
        type: 'gingivitis',
        grade: null,
        stage: null,
        notes: '',
      });
    });
  });

  it('requires grade and stage when periodontitis selected', async () => {
    const { getByText, getByPlaceholderText, queryByText, props } = renderDiagnosisForm();

    fireEvent.press(getByText(/periodontitis/i));
    fireEvent.changeText(getByPlaceholderText(/grade/i), '');
    fireEvent.press(getByText(/save diagnosis/i));

    expect(props.onSubmit).not.toHaveBeenCalled();
    expect(getByText(/grade is required/i)).toBeTruthy();
    expect(getByText(/stage is required/i)).toBeTruthy();

    fireEvent.changeText(getByPlaceholderText(/grade/i), '2');
    fireEvent.changeText(getByPlaceholderText(/stage/i), '3');
    fireEvent.press(getByText(/save diagnosis/i));

    await waitFor(() => {
      expect(props.onSubmit).toHaveBeenLastCalledWith({
        type: 'periodontitis',
        grade: 2,
        stage: 3,
        notes: '',
      });
    });

    expect(queryByText(/grade is required/i)).toBeNull();
  });
});

