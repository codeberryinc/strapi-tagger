import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import CreatableSelect from 'react-select/creatable';
import { MultiValue, ActionMeta } from 'react-select';
import { useIntl } from 'react-intl';
import { Field } from '@strapi/design-system';
import { Box } from '@strapi/design-system';
import { Flex } from '@strapi/design-system';

// ✅ Define the type for API response items
interface Tag {
  id: number;
  title: string;
}

// ✅ Define the type for Select Options
interface SelectOption {
  label: string;
  value: string;
}

// ✅ Function to transform API response to select options
const transformResponseToOptions = (data: any, selectedTags: string[]): SelectOption[] => {
  return (
    data?.data
      ?.map(
        (tag: Tag): SelectOption => ({
          label: tag.title,
          value: tag.id.toString(),
        })
      )
      // ✅ Remove tags that are already selected
      .filter((tag: SelectOption) => !selectedTags.includes(tag.label)) || []
  );
};

const Input = forwardRef<HTMLInputElement, any>(
  ({ name, value, onChange, error, description, disabled, labelAction }, ref) => {
    const { formatMessage } = useIntl();
    const [options, setOptions] = useState<SelectOption[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // ✅ Fetch suggestions only when input has 2+ characters
    const fetchSuggestions = useCallback(async (query: string, selectedTags: string[]) => {
      if (query.length < 2) return; // ✅ Do nothing if fewer than 2 characters are typed

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/tags?fields[0]=title&filters[title][$containsi]=${query}`
        );
        const data = await response.json();

        setOptions(transformResponseToOptions(data, selectedTags));
      } catch (error) {
        console.error('❌ Error fetching tag suggestions:', error);
      }
      setIsLoading(false);
    }, []);

    useEffect(() => {
      if (inputValue.length >= 2) {
        fetchSuggestions(inputValue, value || []);
      }
    }, [inputValue, fetchSuggestions, value]);

    // ✅ Handle value change and ensure it's stored as an array of strings
    const handleChange = (
      newValue: MultiValue<SelectOption>,
      actionMeta: ActionMeta<SelectOption>
    ) => {
      const selectedTags = newValue.map((tag) => tag.label);
      onChange({ target: { name, value: selectedTags } });
    };

    return (
      <Field.Root name={name} error={error} hint={description}>
        <Field.Label action={labelAction}>
          {formatMessage({ id: 'tagger.label', defaultMessage: 'Tags' })}
        </Field.Label>
        <Field.Input as="div">
          <Box padding={2}>
            <Flex direction="column" alignItems="stretch">
              <CreatableSelect
                isMulti
                onInputChange={setInputValue}
                onChange={handleChange}
                options={options} // ✅ Filtered options to remove already selected tags
                value={value ? value.map((tag: string) => ({ label: tag, value: tag })) : []}
                isDisabled={disabled}
                isLoading={isLoading} // ✅ Show loading indicator when fetching
                createOptionPosition="first" // ✅ Prevent unnecessary "Create" prompts
                noOptionsMessage={() =>
                  inputValue.length >= 2
                    ? 'No matching tags found'
                    : 'Type at least 2 characters to search...'
                }
              />
            </Flex>
          </Box>
        </Field.Input>
        {description && <Field.Hint>{description}</Field.Hint>}
        {error && <Field.Error>{error}</Field.Error>}
      </Field.Root>
    );
  }
);

export default Input;
