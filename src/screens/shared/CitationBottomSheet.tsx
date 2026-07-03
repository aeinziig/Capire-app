import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colorTokens, typographyTokens, spacingTokens, borderRadiusTokens, shadowTokens } from '@/styles/design-tokens';
import { useWireframeTheme } from '@/components/wireframe/Wireframe';

// Helper to convert token string (e.g., "16px") to number
const tokenToNumber = (token: string): number => {
  return parseInt(token);
};

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

const CitationBottomSheet: React.FC<{ sourceData: SourceData; onClose: () => void }> = ({ sourceData, onClose }) => {
  const colors = useWireframeTheme();
  const [citation, setCitation] = useState('');
  const [isCopied, setIsCopied] = useState(false);

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

  const handleCopy = () => {
    // In a real app, we would use Clipboard or similar
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = () => {
    // In a real app, we would use Share API
    alert('Share functionality coming soon');
  };

  React.useEffect(() => {
    setCitation(generateAPACitation(sourceData));
  }, [sourceData]);

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.surface,
      ...shadowTokens.base,
      borderTopLeftRadius: tokenToNumber(borderRadiusTokens['3xl']),
      borderTopRightRadius: tokenToNumber(borderRadiusTokens['3xl']),
      padding: tokenToNumber(spacingTokens['6']),
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: tokenToNumber(spacingTokens['4']),
      }}>
        <Text
          style={{
            fontSize: tokenToNumber(typographyTokens.screenTitle.fontSize),
            fontWeight: typographyTokens.screenTitle.fontWeight,
            color: colors.text,
            lineHeight: tokenToNumber(typographyTokens.screenTitle.lineHeight),
          }}
        >
          Generate Citation (APA)
        </Text>
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          style={{ padding: tokenToNumber(spacingTokens['2']) }}
        >
          <Feather name="x" size={tokenToNumber(spacingTokens['4'])} color={colors.muted} />
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: tokenToNumber(spacingTokens['4']) }}>
        {/* Source Type Display */}
        <View style={{ marginBottom: tokenToNumber(spacingTokens['2']) }}>
          <Text
            style={{
              fontSize: tokenToNumber(typographyTokens.label.fontSize),
              fontWeight: typographyTokens.label.fontWeight,
              color: colors.text,
            }}
          >
            Source Type:
          </Text>
          <Text
            style={{
              fontSize: tokenToNumber(typographyTokens.bodyText.fontSize),
              fontWeight: typographyTokens.bodyText.fontWeight,
              color: colors.muted,
              backgroundColor: colors.inputBg,
              paddingHorizontal: tokenToNumber(spacingTokens['2']),
              paddingVertical: tokenToNumber(spacingTokens['0']),
              borderRadius: tokenToNumber(borderRadiusTokens.pill),
            }}
          >
            {sourceData.type}
          </Text>
        </View>

        {/* Title */}
        <View style={{ marginBottom: tokenToNumber(spacingTokens['2']) }}>
          <Text
            style={{
              fontSize: tokenToNumber(typographyTokens.label.fontSize),
              fontWeight: typographyTokens.label.fontWeight,
              color: colors.text,
            }}
          >
            Title:
          </Text>
          <Text
            style={{
              fontSize: tokenToNumber(typographyTokens.bodyText.fontSize),
              fontWeight: typographyTokens.bodyText.fontWeight,
              color: colors.muted,
              backgroundColor: colors.inputBg,
              paddingHorizontal: tokenToNumber(spacingTokens['2']),
              paddingVertical: tokenToNumber(spacingTokens['0']),
              borderRadius: tokenToNumber(borderRadiusTokens.pill),
            }}
          >
            {sourceData.title}
          </Text>
        </View>

        {/* Author/Year if available */}
        {sourceData.author && (
          <View style={{ marginBottom: tokenToNumber(spacingTokens['2']) }}>
            <Text
              style={{
                fontSize: tokenToNumber(typographyTokens.label.fontSize),
                fontWeight: typographyTokens.label.fontWeight,
                color: colors.text,
              }}
            >
              Author:
            </Text>
            <Text
              style={{
                fontSize: tokenToNumber(typographyTokens.bodyText.fontSize),
                fontWeight: typographyTokens.bodyText.fontWeight,
                color: colors.muted,
                backgroundColor: colors.inputBg,
                paddingHorizontal: tokenToNumber(spacingTokens['2']),
                paddingVertical: tokenToNumber(spacingTokens['0']),
                borderRadius: tokenToNumber(borderRadiusTokens.pill),
              }}
            >
              {sourceData.author}
            </Text>
          </View>
        )}

        {sourceData.year && (
          <View style={{ marginBottom: tokenToNumber(spacingTokens['2']) }}>
            <Text
              style={{
                fontSize: tokenToNumber(typographyTokens.label.fontSize),
                fontWeight: typographyTokens.label.fontWeight,
                color: colors.text,
              }}
            >
              Year:
            </Text>
            <Text
              style={{
                fontSize: tokenToNumber(typographyTokens.bodyText.fontSize),
                fontWeight: typographyTokens.bodyText.fontWeight,
                color: colors.muted,
                backgroundColor: colors.inputBg,
                paddingHorizontal: tokenToNumber(spacingTokens['2']),
                paddingVertical: tokenToNumber(spacingTokens['0']),
                borderRadius: tokenToNumber(borderRadiusTokens.pill),
              }}
            >
              {sourceData.year}
            </Text>
          </View>
        )}

        {/* Generated Citation */}
        <View style={{ marginBottom: tokenToNumber(spacingTokens['4']) }}>
          <Text
            style={{
              fontSize: tokenToNumber(typographyTokens.label.fontSize),
              fontWeight: typographyTokens.label.fontWeight,
              color: colors.text,
            }}
          >
            Generated Citation:
          </Text>
          <View style={{
            backgroundColor: colors.inputBg,
            borderRadius: tokenToNumber(borderRadiusTokens.md),
            padding: tokenToNumber(spacingTokens['3']),
            minHeight: tokenToNumber(spacingTokens['6']),
          }}>
            <Text
              style={{
                fontSize: tokenToNumber(typographyTokens.bodyText.fontSize),
                fontWeight: typographyTokens.bodyText.fontWeight,
                color: colors.text,
              }}
            >
              {citation}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: tokenToNumber(spacingTokens['2']) }}>
          <TouchableOpacity
            onPress={handleCopy}
            activeOpacity={0.7}
            style={{
              flex: 1,
              backgroundColor: isCopied ? colorTokens.statusSuccess : colors.accent,
              borderRadius: tokenToNumber(borderRadiusTokens.md),
              paddingVertical: tokenToNumber(spacingTokens['2']),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: tokenToNumber(typographyTokens.buttonText.fontSize),
                fontWeight: typographyTokens.buttonText.fontWeight,
                color: colorTokens.neutralWhite,
              }}
            >
              {isCopied ? 'Copied!' : 'Copy Citation'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.7}
            style={{
              flex: 1,
              backgroundColor: colors.inputBg,
              borderWidth: 1,
              borderColor: colors.line,
              borderRadius: tokenToNumber(borderRadiusTokens.md),
              paddingVertical: tokenToNumber(spacingTokens['2']),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: tokenToNumber(typographyTokens.buttonText.fontSize),
                fontWeight: typographyTokens.buttonText.fontWeight,
                color: colors.text,
              }}
            >
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CitationBottomSheet;
