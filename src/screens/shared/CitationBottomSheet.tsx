import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';

type SourceType = 'Book' | 'Journal Article' | 'Website' | 'Thesis' | 'Conference Paper';

interface SourceData {
  type: SourceType;
  title: string;
  author?: string;
  year?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  url?: string;
  doi?: string;
  institution?: string;
  conference?: string;
}

const CitationBottomSheet: React.FC<{ sourceData: SourceData }> = ({ sourceData }) => {
  const [citation, setCitation] = useState('');

  const sourceTypes: SourceType[] = ['Book', 'Journal Article', 'Website', 'Thesis', 'Conference Paper'];

  const generateAPACitation = (data: SourceData): string => {
    const { type, title, author, year, journal, volume, issue, pages, publisher, url, doi, institution, conference } = data;

    if (!author || !year || !title) return 'Insufficient data for APA citation';

    let citation = `${author} (${year}). ${title}.`;

    switch (type) {
      case 'Book':
        if (publisher) citation += ` ${publisher}.`;
        if (doi) citation += ` https://doi.org/${doi}`;
        break;

      case 'Journal Article':
        if (journal) {
          citation += ` ${journal}`;
          if (volume) citation += `, ${volume}`;
          if (issue) citation += `(${issue})`;
          if (pages) citation += `, ${pages}`;
        }
        if (doi) citation += ` https://doi.org/${doi}`;
        else if (url) citation += ` Retrieved from ${url}`;
        break;

      case 'Website':
        if (institution) citation += ` ${institution}.`;
        if (url) citation += ` Retrieved from ${url}`;
        break;

      case 'Thesis':
        if (institution) citation += ` ${institution}.`;
        break;

      case 'Conference Paper':
        if (conference) citation += ` In ${conference} (Proceedings).`;
        if (publisher) citation += ` ${publisher}.`;
        if (doi) citation += ` https://doi.org/${doi}`;
        break;
    }

    return citation;
  };

  React.useEffect(() => {
    setCitation(generateAPACitation(sourceData));
  }, [sourceData]);

  return (
    <View className="bg-white rounded-t-3l shadow-lg p-6">
      <View className="flex justify-between items-center mb-4">
        <Text className="text-xl font-bold text-gray-800">
          Generate Citation (APA)
        </Text>
        <TouchableOpacity className="p-2">
          <Feather name="x" size={24} className="text-gray-500" />
        </TouchableOpacity>
      </View>

      <View className="space-y-4">
        {/* Source Type Display */}
        <View className="space-y-2">
          <Text className="font-medium text-gray-700">
            Source Type:
          </Text>
          <Text className="text-gray-600 bg-gray-50 px-3 py-1 rounded-inline">
            {sourceData.type}
          </Text>
        </View>

        {/* Title */}
        <View className="space-y-2">
          <Text className="font-medium text-gray-700">
            Title:
          </Text>
          <Text className="text-gray-600 bg-gray-50 px-3 py-1 rounded-inline">
            {sourceData.title}
          </Text>
        </View>

        {/* Author/Year if available */}
        {sourceData.author && (
          <View className="space-y-2">
            <Text className="font-medium text-gray-700">
              Author:
            </Text>
            <Text className="text-gray-600 bg-gray-50 px-3 py-1 rounded-inline">
              {sourceData.author}
            </Text>
          </View>
        )}

        {sourceData.year && (
          <View className="space-y-2">
            <Text className="font-medium text-gray-700">
              Year:
            </Text>
            <Text className="text-gray-600 bg-gray-50 px-3 py-1 rounded-inline">
              {sourceData.year}
            </Text>
          </View>
        )}

        {/* Generated Citation */}
        <View className="space-y-2">
          <Text className="font-medium text-gray-700">
            Generated Citation:
          </Text>
          <View className="p-3 bg-gray-50 rounded-lg min-h-[60px]">
            <Text className="text-gray-800">{citation}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <TouchableOpacity
            activeOpacity={0.7}
            className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 rounded-lg"
          >
            <Text className="text-white font-medium">
              Copy Citation
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 rounded-lg"
          >
            <Text className="text-gray-800 font-medium">
              Share Citation
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CitationBottomSheet;