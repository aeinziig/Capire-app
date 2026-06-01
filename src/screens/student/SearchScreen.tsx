import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, FlatList, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

type CapstoneItem = {
  id: number;
  title: string;
  author: string;
  department: string;
  year: string;
  originalityScore: number;
  imageUrl?: string;
};

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    department: 'All',
    year: 'All',
    sortBy: 'recent' // recent, relevance, originality
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - in real app this would come from Supabase
  const allCapstones: CapstoneItem[] = [
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
    },
    {
      id: 4,
      title: 'Machine Learning for Climate Change Prediction',
      author: 'Sarah Chen',
      department: 'Environmental Science',
      year: '2023',
      originalityScore: 91,
      imageUrl: 'https://images.unsplash.com/photo-1450177040553-1d09576b8bbb?w=400'
    },
    {
      id: 5,
      title: 'Augmented Reality in Medical Education',
      author: 'James Wilson',
      department: 'Medicine',
      year: '2022',
      originalityScore: 85,
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2392d14470b9?w=400'
    }
  ];

  // Filter capstones based on search and filters
  const filteredCapstones = allCapstones.filter(capstone => {
    const matchesSearch =
      capstone.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capstone.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capstone.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      filters.department === 'All' ||
      capstone.department === filters.department;

    const matchesYear =
      filters.year === 'All' ||
      capstone.year === filters.year;

    return matchesSearch && matchesDepartment && matchesYear;
  });

  // Sort capstones
  const sortedCapstones = [...filteredCapstones].sort((a, b) => {
    switch (filters.sortBy) {
      case 'recent':
        return parseInt(b.year) - parseInt(a.year);
      case 'originality':
        return b.originalityScore - a.originalityScore;
      case 'relevance':
      default:
        return 0; // Keep original order for relevance (simplified)
    }
  });

  const departments = [
    'All',
    'Computer Science',
    'Urban Planning',
    'Political Science',
    'Environmental Science',
    'Medicine',
    'Engineering',
    'Business',
    'Psychology'
  ];

  const years = [
    'All',
    '2023',
    '2022',
    '2021',
    '2020'
  ];

  const handlePressCapstone = (capstone: CapstoneItem) => {
    // Navigate to capstone detail screen
    // In real app: navigation.navigate('CapstoneDetail', { capstoneId: capstone.id })
    console.log('Navigate to capstone detail:', capstone.id);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        {/* Search Bar */}
        <View className="flex items-center space-x-3 mb-4 bg-gray-50 p-3 rounded-lg">
          <Feather name="search" size={20} className="text-gray-400" />
          <TextInput
            placeholder="Search capstones..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 bg-white border border-gray-300 rounded-lg p-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          />
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className="p-2"
          >
            <Feather name="sliders" size={20} className="text-gray-500" />
          </TouchableOpacity>
        </View>

        {/* Filters Panel */}
        {showFilters && (
          <View className="mb-4 p-4 bg-gray-50 rounded-lg">
            <Text className="font-medium text-gray-700 mb-3">
              Filters
            </Text>

            <View className="space-y-3">
              {/* Department Filter */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Department
                </Text>
                <View className="border border-gray-300 rounded-lg p-2">
                  {departments.map((dept, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      onPress={() => setFilters(prev => ({...prev, department: dept}))}
                      className={`p-2 ${filters.department === dept
                        ? 'bg-primary-50 text-primary-600'
                        : 'bg-white text-gray-700'
                      } rounded-lg`}
                    >
                      <Text className="text-sm">{dept}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Year Filter */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Year
                </Text>
                <View className="border border-gray-300 rounded-lg p-2">
                  {years.map((year, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      onPress={() => setFilters(prev => ({...prev, year: year}))}
                      className={`p-2 ${filters.year === year
                        ? 'bg-primary-50 text-primary-600'
                        : 'bg-white text-gray-700'
                      } rounded-lg`}
                    >
                      <Text className="text-sm">{year}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Sort By Filter */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </Text>
                <View className="border border-gray-300 rounded-lg p-2">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setFilters(prev => ({...prev, sortBy: 'recent'}))}
                    className={`p-2 ${filters.sortBy === 'recent'
                      ? 'bg-primary-50 text-primary-600'
                      : 'bg-white text-gray-700'
                    } rounded-lg`}
                  >
                    <Text className="text-sm">Recent</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setFilters(prev => ({...prev, sortBy: 'originality'}))}
                    className={`p-2 ${filters.sortBy === 'originality'
                      ? 'bg-primary-50 text-primary-600'
                      : 'bg-white text-gray-700'
                    } rounded-lg`}
                  >
                    <Text className="text-sm">Originality</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setFilters(prev => ({...prev, sortBy: 'relevance'}))}
                    className={`p-2 ${filters.sortBy === 'relevance'
                      ? 'bg-primary-50 text-primary-600'
                      : 'bg-white text-gray-700'
                    } rounded-lg`}
                  >
                    <Text className="text-sm">Relevance</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Results Count */}
        <View className="mb-4">
          <Text className="text-sm text-gray-500">
            {sortedCapstones.length} results found
          </Text>
        </View>

        {/* Results List */}
        <ScrollView>
          {sortedCapstones.length === 0 ? (
            <View className="p-8 items-center justify-center">
              <Feather name="search" size={48} className="text-gray-300 mb-4" />
              <Text className="text-gray-500 text-center">
                No capstones found matching your search
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              {sortedCapstones.map((capstone, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePressCapstone(capstone)}
                  activeOpacity={0.7}
                  className="p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <View className="flex items-start space-x-4">
                    {/* Capstone Image */}
                    {capstone.imageUrl && (
                      <View className="w-16 h-16 rounded-lg overflow-hidden">
                        {/* In real app, would use Image component */}
                        <View className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Feather name="book" size={16} className="text-gray-400" />
                        </View>
                      </View>
                    )}

                    {/* Capstone Details */}
                    <View className="flex-1">
                      <Text className="font-medium text-gray-800">
                        {capstone.title}
                      </Text>
                      <View className="flex items-center space-x-2 mt-1">
                        <Text className="text-sm text-gray-500">
                          {capstone.author} • {capstone.department} • {capstone.year}
                        </Text>
                      </View>
                      <View className="mt-2">
                        <Text className="text-sm font-medium text-gray-700">
                          Originality Score:
                        </Text>
                        <View className="flex items-center space-x-2">
                          <View className={`w-3 h-3 rounded-full ${
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
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default SearchScreen;