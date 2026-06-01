import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

type BookmarkItem = {
  id: number;
  title: string;
  author: string;
  department: string;
  year: string;
  originalityScore: number;
  imageUrl?: string;
};

const BookmarksScreen: React.FC = () => {
  // Mock data - in real app this would come from Supabase based on user ID
  const bookmarks: BookmarkItem[] = [
    {
      id: 1,
      title: 'AI Applications in Early Cancer Detection',
      author: 'Alex Johnson',
      department: 'Computer Science',
      year: '2023',
      originalityScore: 88,
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400'
    },
    {
      id: 2,
      title: 'Sustainable Urban Planning for Growing Cities',
      author: 'Maria Garcia',
      department: 'Urban Planning',
      year: '2023',
      originalityScore: 92,
      imageUrl: 'https://images.unsplash.com/photo-1486401899868-a9c40aa2538e?w=400'
    },
    {
      id: 3,
      title: 'Blockchain Technology for Secure Voting Systems',
      author: 'David Kim',
      department: 'Political Science',
      year: '2022',
      originalityScore: 76,
      imageUrl: 'https://images.unsplash.com/photo-1550751826-4bb2a3c335ea?w=400'
    }
  ];

  const handleRemoveBookmark = (id: number) => {
    // In real app, this would remove from Supabase
    console.log(`Remove bookmark with ID: ${id}`);
  };

  const handlePressBookmark = (bookmark: BookmarkItem) => {
    // Navigate to capstone detail screen
    // In real app: navigation.navigate('CapstoneDetail', { capstoneId: bookmark.id })
    console.log('Navigate to capstone detail:', bookmark.id);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <View className="space-y-4">
          <Text className="text-2xl font-bold text-gray-800">
            Bookmarks
          </Text>
          <Text className="text-sm text-gray-500">
            Your saved capstone projects
          </Text>
        </View>

        {bookmarks.length === 0 ? (
          <View className="p-8 items-center justify-center">
            <Feather name="bookmark-off" size={48} className="text-gray-300 mb-4" />
            <Text className="text-gray-500 text-center">
              You haven't bookmarked any capstones yet
            </Text>
          </View>
        ) : (
          <ScrollView>
            <View className="space-y-4">
              {bookmarks.map((bookmark, index) => (
                <View key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <View className="flex justify-between items-start mb-3">
                    <View className="flex items-start space-x-3">
                      {/* Bookmark Image */}
                      {bookmark.imageUrl && (
                        <View className="w-10 h-10 rounded-lg overflow-hidden">
                          {/* In real app, would use Image component */}
                          <View className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Feather name="book" size={12} className="text-gray-400" />
                          </View>
                        </View>
                      )}

                      {/* Bookmark Details */}
                      <View className="flex-1">
                        <Text className="font-medium text-gray-800">
                          {bookmark.title}
                        </Text>
                        <View className="flex items-center space-x-2 mt-1">
                          <Text className="text-sm text-gray-500">
                            {bookmark.author} • {bookmark.department} • {bookmark.year}
                          </Text>
                        </View>
                        <View className="mt-2">
                          <Text className="text-sm font-medium text-gray-700">
                            Originality Score:
                          </Text>
                          <View className="flex items-center space-x-2">
                            <View className={`w-3 h-3 rounded-full ${
                              bookmark.originalityScore >= 90
                                ? 'bg-green-500'
                                : bookmark.originalityScore >= 75
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            }`} />
                            <Text className="text-sm font-medium text-gray-600">
                              {bookmark.originalityScore}%
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Remove Bookmark Button */}
                    <TouchableOpacity
                      onPress={() => handleRemoveBookmark(bookmark.id)}
                      activeOpacity={0.7}
                      className="p-2"
                    >
                      <Feather name="trash-2" size={20} className="text-red-500" />
                    </TouchableOpacity>
                  </View>

                  {/* Divider */}
                  <View className="h-0.5 bg-gray-200 my-3" />

                  {/* Action Buttons */}
                  <View className="flex justify-end space-x-3">
                    <TouchableOpacity
                      onPress={() => handlePressBookmark(bookmark)}
                      activeOpacity={0.7}
                      className="p-2 bg-primary-50 rounded-lg"
                    >
                      <Feather name="eye" size={20} className="text-primary-600" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        // Share functionality would go here
                      }}
                      activeOpacity={0.7}
                      className="p-2 bg-primary-50 rounded-lg"
                    >
                      <Feather name="share-2" size={20} className="text-primary-600" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default BookmarksScreen;