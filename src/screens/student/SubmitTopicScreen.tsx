import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import {
  AppLayout,
  HeaderIconButton,
  WireframeButton,
  WireframeCard,
  WireframeInput,
  WireframePill,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type FormErrors = Partial<Record<'title' | 'abstract' | 'author' | 'year' | 'department', string>>;

const departments = ['Computer Science', 'Information Technology', 'Engineering', 'Business', 'Psychology', 'Education'];
const years = ['2022', '2023', '2024', '2025'];

const SubmitTopicScreen: React.FC = () => {
  const wireframeColors = useWireframeTheme();
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [department, setDepartment] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    const nextErrors: FormErrors = {};
    if (!title.trim()) nextErrors.title = 'Title is required.';
    if (!abstract.trim()) nextErrors.abstract = 'Abstract is required.';
    if (!author.trim()) nextErrors.author = 'Author is required.';
    if (!year) nextErrors.year = 'Select a year.';
    if (!department) nextErrors.department = 'Select a department.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      setLoading(false);
      setMessage('Topic submitted successfully. It is now waiting for faculty review.');
    }, 1000);
  };

  return (
    <AppLayout
      title="Propose a topic"
      subtitle="Turn an early idea into a review-ready submission for faculty feedback."
      headerRight={<HeaderIconButton icon="zap" />}
    >
      <WireframeCard style={{ marginBottom: 16, backgroundColor: '#EDF8EF' }}>
        <Text style={{ color: wireframeColors.text, fontSize: 16, fontWeight: '800' }}>AI originality guidance</Text>
        <Text style={{ color: wireframeColors.muted, fontSize: 13, lineHeight: 19, marginTop: 8 }}>
          Keep the title specific, clarify the target users, and mention the main technology or research method.
        </Text>
      </WireframeCard>

      <WireframeCard>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{ color: wireframeColors.text, fontSize: 18, fontWeight: '800', marginBottom: 16 }}>
            Topic information
          </Text>

          <WireframeInput label="Title" icon="type" value={title} onChangeText={setTitle} placeholder="Proposed capstone title" error={errors.title} />
          <WireframeInput label="Author" icon="user" value={author} onChangeText={setAuthor} placeholder="Your full name" error={errors.author} />

          <Text style={{ color: wireframeColors.text, fontSize: 12, fontWeight: '700', marginBottom: 8 }}>Abstract / Description</Text>
          <View
            style={{
              minHeight: 150,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: errors.abstract ? wireframeColors.danger : wireframeColors.line,
              backgroundColor: '#FAFCFA',
              paddingHorizontal: 16,
              paddingVertical: 14,
              marginBottom: 8,
            }}
          >
            <TextInput
              value={abstract}
              onChangeText={setAbstract}
              placeholder="Describe the problem, users, and expected output."
              placeholderTextColor="#95A79D"
              multiline
              textAlignVertical="top"
              style={{ color: wireframeColors.text, minHeight: 120, fontSize: 14 }}
            />
          </View>
          {errors.abstract ? <Text style={{ color: wireframeColors.danger, fontSize: 12, marginBottom: 14 }}>{errors.abstract}</Text> : null}

          <Text style={{ color: wireframeColors.text, fontSize: 12, fontWeight: '700', marginBottom: 8 }}>School Year</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {years.map((item) => (
              <WireframePill key={item} label={item} active={year === item} onPress={() => setYear(item)} />
            ))}
          </View>
          {errors.year ? <Text style={{ color: wireframeColors.danger, fontSize: 12, marginBottom: 14 }}>{errors.year}</Text> : null}

          <Text style={{ color: wireframeColors.text, fontSize: 12, fontWeight: '700', marginBottom: 8 }}>Department</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {departments.map((item) => (
              <WireframePill key={item} label={item} active={department === item} onPress={() => setDepartment(item)} />
            ))}
          </View>
          {errors.department ? <Text style={{ color: wireframeColors.danger, fontSize: 12, marginBottom: 14 }}>{errors.department}</Text> : null}

          <WireframeInput
            label="Keywords"
            icon="tag"
            value={keywords}
            onChangeText={setKeywords}
            placeholder="AI, healthcare, mobile, records"
          />

          {message ? (
            <View
              style={{
                borderRadius: 18,
                borderWidth: 1,
                borderColor: '#C5E2CE',
                backgroundColor: '#F1FAF3',
                padding: 14,
                marginBottom: 18,
              }}
            >
              <Text style={{ color: wireframeColors.accent, fontSize: 13 }}>{message}</Text>
            </View>
          ) : null}

          <WireframeButton label={loading ? 'Submitting...' : 'Submit Topic'} onPress={handleSubmit} disabled={loading} icon="send" />
        </ScrollView>
      </WireframeCard>
    </AppLayout>
  );
};

export default SubmitTopicScreen;
