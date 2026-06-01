import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';

type CapstoneItem = {
  id: number;
  title: string;
  author: string;
  department: string;
  year: string;
  abstract: string;
  originalityScore: number;
  keywords: string[];
  pdfUrl?: string;
  imageUrl?: string;
};

const CapstoneDetailScreen: React.FC<{ capstoneId: number }> = ({ capstoneId }) => {
  const [capstone, setCapstone] = useState<CapstoneItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock data - in real app this would come from Supabase
  const mockCapstones: CapstoneItem[] = [
    {
      id: 1,
      title: 'AI Applications in Early Cancer Detection',
      author: 'Alex Johnson',
      department: 'Computer Science',
      year: '2023',
      abstract: 'This research explores the use of machine learning algorithms for detecting early signs of cancer from medical imaging data. We propose a novel CNN architecture that achieves 94.2% accuracy on the test dataset.',
      originalityScore: 88,
      keywords: ['machine learning', 'cancer detection', 'medical imaging', 'deep learning'],
      pdfUrl: 'https://example.com/papers/ai-cancer-detection.pdf',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400'
    },
    {
      id: 2,
      title: 'Sustainable Urban Planning for Growing Cities',
      author: 'Maria Garcia',
      department: 'Urban Planning',
      year: '2023',
      abstract: 'Analyzing strategies for sustainable urban development in rapidly growing metropolitan areas. Focuses on green infrastructure, public transportation optimization, and mixed-use zoning.',
      originalityScore: 92,
      keywords: ['urban planning', 'sustainability', 'green infrastructure', 'transportation'],
      pdfUrl: 'https://example.com/papers/sustainable-urban-planning.pdf',
      imageUrl: 'https://images.unsplash.com/photo-1486401899868-a9c40aa2538e?w=400'
    },
    {
      id: 3,
      title: 'Blockchain Technology for Secure Voting Systems',
      author: 'David Kim',
      department: 'Political Science',
      year: '2022',
      abstract: 'Examining the feasibility of using blockchain technology to create secure and transparent voting systems. Proposes a hybrid consensus mechanism suitable for national elections.',
      originalityScore: 76,
      keywords: ['blockchain', 'voting', 'security', 'cryptography'],
      pdfUrl: 'https://example.com/papers/blockchain-voting.pdf',
      imageUrl: 'https://images.unsplash.com/photo-1550751826-4bb2a3c335ea?w=400'
    }
  ];

  React.useEffect(() => {
    // Simulate loading capstone data
    setTimeout(() => {
      const foundCapstone = mockCapstones.find(c => c.id === capstoneId);
      if (foundCapstone) {
        setCapstone(foundCapstone);
        // In real app, check if bookmarked
        setIsBookmarked(false); // Mock value
      } else {
        setError('Capstone not found');
      }
      setLoading(false);
    }, 1000);
  }, [capstoneId]);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In real app, this would update Supabase
  };

  const handlePdfPress = () => {
    setShowPdfModal(true);
    // In real app, this would open the PDF
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2EA95B" />
        <Text className="mt-4 text-gray-600">Loading capstone details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Text className="text-red-600">{error}</Text>
        <TouchableOpacity
          onPress={() => {
            // Go back - in real app would use navigation.goBack()
          }}
          className="mt-4 p-2 bg-primary-600 text-white rounded-lg"
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!capstone) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Text className="text-gray-600">No capstone data available</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* PDF Modal */}
      <Modal
        transparent={true}
        visible={showPdfModal}
        onRequestClose={() => setShowPdfModal(false)}
      >
        <View className="flex-1 items-center justify-center bg-black-500">
          <View className="w-11/12 bg-white rounded-lg p-4 max-w-md">
            <View className="flex justify-between items-start mb-3">
              <Text className="font-medium text-gray-800">
                {capstone.title}
              </Text>
              <TouchableOpacity
                onPress={() => setShowPdfModal(false)}
                className="p-2"
              >
                <Feather name="x" size={24} className="text-gray-500" />
              </TouchableOpacity>
            </View>

            <View className="flex items-center justify-center">
              {/* In real app, would use PDF viewer or Linking.openUrl */}
              <View className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <Feather name="file-text" size={32} className="text-gray-400" />
                <Text className="mt-2 text-sm text-gray-500">
                  {capstone.pdfUrl ? 'View PDF' : 'PDF not available'}
                </Text>
              </View>
            </View>

            <View className="mt-4">
              <TouchableOpacity
                onPress={() => setShowPdfModal(false)}
                className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 rounded-lg"
              >
                <Text className="text-white font-medium">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800">
            {capstone.title}
          </Text>
          <View className="flex items-center space-x-3 mt-2">
            <Text className="text-sm text-gray-500">
              {capstone.author} • {capstone.department} • {capstone.year}
            </Text>
          </View>

          {/* Originality Score Badge */}
          <View className="mt-3">
            <Text className="text-sm font-medium text-gray-700">
              Originality Score:
            </Text>
            <View className="flex items-center space-x-2 mt-1">
              <View className={`w-4 h-4 rounded-full ${
                capstone.originalityScore >= 90
                  ? 'bg-green-500'
                  : capstone.originalityScore >= 75
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`} />
              <Text className="text-sm font-medium text-gray-600">
                {capstone.originalityScore}%
              </Text>
            </View>
          </View>
        </View>

        {/* Abstract */}
        <View className="mb-6">
          <Text className="font-semibold text-gray-800 mb-2">
            Abstract
          </Text>
          <Text className="text-gray-700 leading-relaxed">
            {capstone.abstract}
          </Text>
        </View>

        {/* Keywords */}
        {capstone.keywords.length > 0 && (
          <View className="mb-6">
            <Text className="font-semibold text-gray-800 mb-2">
              Keywords
            </Text>
            <View className="flex flex-wrap gap-2">
              {capstone.keywords.map((keyword, index) => (
                <View key={index} className="px-3 py-1 bg-primary-50 rounded-lg text-sm">
                  <Text className="text-primary-600">{keyword}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="mb-6">
          <View className="space-y-3">
            <TouchableOpacity
              onPress={toggleBookmark}
              activeOpacity={0.7}
              className={`w-full flex items-center justify-center px-4 py-2 border-2 ${
                isBookmarked
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-300 bg-white'
              } rounded-lg`}
            >
              <View className="flex items-center space-x-2">
                <Feather name={isBookmarked ? 'bookmark' : 'bookmark-off'} size={20} className={`${isBookmarked
                  ? 'text-primary-600'
                  : 'text-gray-500'
                }`} />
                <Text className="font-medium text-gray-800">
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePdfPress}
              activeOpacity={0.7}
              className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 rounded-lg"
            >
              <View className="flex items-center space-x-2">
                <Feather name="file-text" size={20} className="text-white" />
                <Text className="text-white font-medium">
                  View PDF
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CapstoneDetailScreen;