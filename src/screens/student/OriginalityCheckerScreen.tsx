import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator, FlatList, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CitationBottomSheet } from '../shared/CitationBottomSheet';

type SimilaritySource = {
  id: number;
  title: string;
  author: string;
  year: string;
  similarityPercentage: number;
  matchedText: string;
  sourceText: string;
};

const OriginalityCheckerScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    originalityScore: number;
    similaritySources: SimilaritySource[];
    highlightedText: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState<SimilaritySource | null>(null);

  // Simulate file picking (in real app, would use document picker or image picker)
  const handleFilePick = () => {
    // Simulate picking a file
    setFileName('research_paper_final.docx');
    setInputText('This is a sample text that would be extracted from the document for originality checking...');
  };

  const handleCheckOriginality = async () => {
    if (!inputText.trim() && !fileName) {
      setError('Please enter text or select a file to check');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call to originality checking service
      // In real app, this would send data to backend/Supabase function
      setTimeout(() => {
        const mockResult = {
          originalityScore: 82,
          similaritySources: [
            {
              id: 1,
              title: 'Machine Learning Approaches to Cancer Detection',
              author: 'Smith, J. et al.',
              year: '2022',
              similarityPercentage: 18,
              matchedText: 'machine learning algorithms for detecting early signs',
              sourceText: 'machine learning algorithms for detecting early signs of disease from medical images'
            },
            {
              id: 2,
              title: 'Deep Learning in Medical Imaging Review',
              author: 'Johnson, A. & Lee, K.',
              year: '2023',
              similarityPercentage: 12,
              matchedText: 'CNN architecture that achieves high accuracy',
              sourceText: 'CNN architecture that achieves high accuracy on medical imaging tasks'
            }
          ],
          highlightedText: 'This research explores the use of [machine learning algorithms] for detecting early signs of cancer from medical imaging data. We propose a novel [CNN architecture] that achieves 94.2% accuracy on the test dataset.'
        };

        setResults(mockResult);
        setLoading(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Originality check failed');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setFileName(null);
    setResults(null);
    setError(null);
    setSelectedSource(null);
    setShowCitationModal(false);
  };

  const handleViewCitation = (source: SimilaritySource) => {
    setSelectedSource(source);
    setShowCitationModal(true);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <View className="space-y-4">
          <Text className="text-2xl font-bold text-gray-800">
            Originality Checker
          </Text>
          <Text className="text-sm text-gray-500">
            Check your work for similarity against academic databases
          </Text>
        </View>

        {/* File Input Section */}
        <View className="space-y-3">
          <Text className="font-medium text-gray-700 mb-1">
            Select File or Enter Text
          </Text>

          <View className="border border-gray-300 rounded-lg p-4 flex items-center space-x-3">
            <Feather name="paperclip" size={24} className="text-gray-400" />
            <TouchableOpacity
              onPress={handleFilePick}
              activeOpacity={0.7}
            >
              <Text className="font-medium text-gray-600">
                {fileName || 'Select File'}
              </Text>
            </TouchableOpacity>
          </View>

          {fileName && (
            <View className="mt-2 p-3 bg-primary-50 rounded-lg">
              <Text className="text-sm text-primary-600">
                Selected: {fileName}
              </Text>
            </View>
          )}
        </View>

        {/* Text Input Section */}
        <View className="space-y-3">
          <Text className="font-medium text-gray-700 mb-1">
            Or Paste Text Directly
          </Text>

          <TextInput
            placeholder="Paste your text here to check originality..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            minHeight={100}
            className="border border-gray-300 rounded-lg p-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-base"
          />
        </View>

        {error && (
          <View className="p-3 bg-red-50 rounded-lg">
            <Text className="text-sm text-red-600">{error}</Text>
          </View>
        )}

        <View className="space-y-3">
          <TouchableOpacity
            onPress={handleCheckOriginality}
            disabled={loading || (!inputText.trim() && !fileName)}
            className={`w-full flex items-center justify-center px-4 py-2 bg-primary-600 rounded-lg ${
              loading || (!inputText.trim() && !fileName) ? 'opacity-70' : ''
            }`}
          >
            {loading ? (
              <>
                <Feather name="loader" size={16} color="white" className="mr-2" />
                <Text className="text-white font-medium">Checking...</Text>
              </>
            ) : (
              <Text className="text-white font-medium">Check Originality</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleReset}
            activeOpacity={0.7}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-500"
          >
            Reset
          </TouchableOpacity>
        </View>

        {/* Results Section */}
        {results && (
          <View className="space-y-4">
            <View className="border-t border-gray-200 pt-4">
              <Text className="font-semibold text-gray-800 mb-2">
                Originality Results
              </Text>

              {/* Originality Score */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700">
                  Originality Score:
                </Text>
                <View className="flex items-center space-x-2 mt-1">
                  <View className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    results.originalityScore >= 90
                      ? 'bg-green-500'
                      : results.originalityScore >= 75
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}>
                    <Text className="text-white font-medium">
                      {results.originalityScore}%
                    </Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-600">
                    {results.originalityScore >= 90 ? 'High' : results.originalityScore >= 75 ? 'Medium' : 'Low'}
                  </Text>
                </View>
              </View>

              {/* Similarity Sources */}
              {results.similaritySources.length > 0 && (
                <View className="mb-4">
                  <Text className="font-semibold text-gray-800 mb-2">
                    Similarity Sources
                  </Text>
                  <View className="space-y-2">
                    {results.similaritySources.map((source, index) => (
                      <View key={index} className="p-3 bg-gray-50 rounded-lg">
                        <View className="flex justify-between items-start mb-2">
                          <Text className="font-medium text-gray-800">
                            {source.title}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            {source.similarityPercentage}% match
                          </Text>
                        </View>

                        <View className="space-y-2">
                          <Text className="text-sm text-gray-600">
                            <Text className="font-medium">By:</Text> {source.author} ({source.year})
                          </Text>
                        </View>

                        <View className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
                          <Text className="text-xs text-gray-600">
                            <Text className="font-medium">Matched text:</Text> "{source.matchedText}"
                          </Text>
                          <Text className="text-xs text-gray-600 mt-1">
                            <Text className="font-medium">Source text:</Text> "{source.sourceText}"
                          </Text>
                        </View>

                        {/* View Citation Button */}
                        <View className="mt-3">
                          <TouchableOpacity
                            onPress={() => handleViewCitation(source)}
                            activeOpacity={0.7}
                            className="w-full flex items-center justify-center px-4 py-2 bg-primary-50 rounded-lg"
                          >
                            <Feather name="file-text" size={20} className="text-primary-600" />
                            <Text className="text-sm font-medium text-gray-600">
                              View APA Citation
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Highlighted Text */}
              <View className="mb-4">
                <Text className="font-semibold text-gray-800 mb-2">
                  Text with Highlighted Matches
                </Text>
                <View className="p-3 bg-gray-50 rounded-lg">
                  <Text className="text-gray-700">
                    {/* Simple highlighting - in real app would be more sophisticated */}
                    {results.highlightedText
                      .replace(/\[(.*?)\]/g, '<span className="bg-primary-200">$1</span>')
                    }
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Citation Modal */}
      <Modal
        transparent={true}
        visible={showCitationModal}
        onRequestClose={() => setShowCitationModal(false)}
      >
        <View className="flex-1 items-center justify-center bg-black-500">
          {selectedSource && (
            <CitationBottomSheet
              sourceData={{
                type: 'Journal Article', // Default type, could be made dynamic
                title: selectedSource.title,
                author: selectedSource.author,
                year: selectedSource.year,
                // Additional fields could be added based on available data
              }}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default OriginalityCheckerScreen;