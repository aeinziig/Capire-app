import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, ActivityIndicator, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';

type TopicItem = {
  id: number;
  title: string;
  studentName: string;
  department: string;
  submittedAt: string;
  abstract: string;
  originalityScore: number;
  status: 'pending' | 'approved' | 'rejected';
};

const TopicReviewScreen: React.FC = () => {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  // Mock data - in real app this would come from Supabase
  const mockTopics: TopicItem[] = [
    {
      id: 1,
      title: 'AI Applications in Early Cancer Detection',
      studentName: 'Alex Johnson',
      department: 'Computer Science',
      submittedAt: '2023-11-20',
      abstract: 'This research explores the use of machine learning algorithms for detecting early signs of cancer from medical imaging data.',
      originalityScore: 88,
      status: 'pending'
    },
    {
      id: 2,
      title: 'Sustainable Urban Planning for Growing Cities',
      studentName: 'Maria Garcia',
      department: 'Urban Planning',
      submittedAt: '2023-11-18',
      abstract: 'Analyzing strategies for sustainable urban development in rapidly growing metropolitan areas.',
      originalityScore: 92,
      status: 'pending'
    },
    {
      id: 3,
      title: 'Blockchain Technology for Secure Voting Systems',
      studentName: 'David Kim',
      department: 'Political Science',
      submittedAt: '2023-11-15',
      abstract: 'Examining the feasibility of using blockchain technology to create secure and transparent voting systems.',
      originalityScore: 76,
      status: 'pending'
    }
  ];

  React.useEffect(() => {
    // Simulate loading topics from database
    setTimeout(() => {
      setTopics(mockTopics);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = () => {
    if (!selectedTopic) return;

    setLoading(true);
    // In real app, this would update the topic status in Supabase
    setTimeout(() => {
      setTopics(prev =>
        prev.map(topic =>
          topic.id === selectedTopic!.id
            ? { ...topic, status: 'approved' }
            : topic
        )
      );
      setSelectedTopic(null);
      setReviewComment('');
      setLoading(false);
    }, 800);
  };

  const handleReject = () => {
    if (!selectedTopic) return;

    setLoading(true);
    // In real app, this would update the topic status in Supabase
    setTimeout(() => {
      setTopics(prev =>
        prev.map(topic =>
          topic.id === selectedTopic!.id
            ? { ...topic, status: 'rejected' }
            : topic
        )
      );
      setSelectedTopic(null);
      setReviewComment('');
      setLoading(false);
    }, 800);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2EA95B" />
        <Text className="mt-4 text-gray-600">Loading topics...</Text>
      </View>
    );
  }

  const pendingTopics = topics.filter(topic => topic.status === 'pending');

  if (pendingTopics.length === 0) {
    return (
      <View className="flex-1 bg-white">
        <View className="p-8 items-center justify-center">
          <Feather name="check-circle" size={48} className="text-green-500 mb-4" />
          <Text className="text-lg font-medium text-gray-600">
            All topics reviewed!
          </Text>
          <Text className="text-sm text-gray-500 text-center mt-2">
            No pending topics awaiting review
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <View className="flex justify-between items-start mb-4">
          <Text className="text-2xl font-bold text-gray-800">
            Topic Review
          </Text>
          <Text className="text-sm text-gray-600">
            {pendingTopics.length} pending
          </Text>
        </View>

        <ScrollView className="mb-4" contentContainerClassName="pb-4">
          {pendingTopics.map((topic, index) => (
            <View
              key={index}
              onPress={() => {
                setSelectedTopic(topic);
                setReviewComment(topic.abstract || '');
              }}
              activeOpacity={0.7}
              className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-200"
            >
              <View className="flex justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-lg font-medium text-gray-800">
                    {topic.title}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    by {topic.studentName} | {topic.department}
                  </Text>
                </View>
                <View className="flex items-center space-x-2">
                  <View className={`w-2 h-2 ${topic.originalityScore >= 90
                    ? 'bg-green-500'
                    : topic.originalityScore >= 75
                      ? 'bg-yellow-500'
                      : 'bg-red-500'`} /> }
                  <Text className="text-sm font-medium text-gray-600">
                    {topic.originalityScore}%
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-gray-400">
                Submitted: {topic.submittedAt}
              </Text>
            </View>

            {/* Preview abstract */}
            {topic.abstract && (
              <View className="mt-2">
                <Text className="text-sm text-gray-600 line-clamp-2">
                  {topic.abstract}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Review Modal */}
      {selectedTopic && (
        <View className="absolute bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-200">
          <View className="space-y-4">
            <View className="flex justify-between items-start mb-2">
              <Text className="text-lg font-semibold text-gray-800">
                Reviewing: {selectedTopic.title}
              </Text>
              <Text className="text-sm text-gray-500">
                by {selectedTopic.studentName}
              </Text>
            </View>

            <View className="space-y-2">
              <Text className="text-lg font-semibold text-gray-800">
                Abstract
              </Text>
              <Text className="text-gray-700 leading-relaxed">
                {selectedTopic.abstract}
              </Text>
            </View>

            <View className="space-y-2">
              <Text className="text-lg font-semibold text-gray-800">
                Review Comments
              </Text>
              <TextInput
                placeholder="Add your comments or feedback..."
                value={reviewComment}
                onChangeText={setReviewComment}
                multiline
                minHeight={80}
                className="border border-gray-300 rounded-lg p-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-base"
              />
            </View>

            <View className="flex justify-end space-x-3 mt-4">
              <TouchableOpacity
                onPress={() => {
                  setSelectedTopic(null);
                  setReviewComment('');
                }}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm"
              >
                Cancel
              </TouchableOpacity>

              <View className="flex flex-row space-x-2">
                <TouchableOpacity
                  onPress={handleReject}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md ${loading
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-red-50 text-white'
                  }`}
                >
                  {loading ? (
                    <>
                      <Feather name="loader" size={16} color="white" className="mr-2" />
                      <Text>Rejecting...</Text>
                    </>
                  ) : (
                    <Text>Reject</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleApprove}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md ${loading
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-primary-600 text-white'
                  }`}
                >
                  {loading ? (
                    <>
                      <Feather name="loader" size={16} color="white" className="mr-2" />
                      <Text>Approving...</Text>
                    </>
                  ) : (
                    <Text>Approve</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default TopicReviewScreen;