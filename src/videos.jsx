import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Home, Clock, Users, Star, Heart, X, Volume2, Maximize } from "lucide-react";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
  padding: 1rem;
`;

const Header = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  font-family: "Playwrite DE SAS", cursive;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #6b7280;
  margin: 0.25rem 0 0 0;
  font-family: "Gowun Dodum", cursive;
`;

const HomeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #597c49ff;
  color: white;
  border-radius: 2rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Gowun Dodum", cursive;
  box-shadow: 0 4px 16px rgba(89, 124, 73, 0.3);

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(89, 124, 73, 0.4);
  }
`;

const FilterContainer = styled(motion.div)`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.1);
`;

const FilterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CategoryButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
`;

const CategoryButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  font-family: "Gowun Dodum", cursive;
  background: ${props => props.active ? '#597c49ff' : 'rgba(255, 255, 255, 0.6)'};
  color: ${props => props.active ? 'white' : '#374151'};
  box-shadow: ${props => props.active ? '0 4px 12px rgba(89, 124, 73, 0.3)' : 'none'};

  &:hover {
    background: ${props => props.active ? '#597c49ff' : 'rgba(255, 255, 255, 0.8)'};
    transform: translateY(-1px);
  }
`;

const VideosGrid = styled(motion.div)`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const VideoCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
  }
`;

const ThumbnailContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 12rem;
  object-fit: cover;
`;

const ThumbnailOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  ${VideoCard}:hover & {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const PlayIconContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 0.75rem;
  transition: transform 0.3s ease;

  ${VideoCard}:hover & {
    transform: scale(1.1);
  }
`;

const DurationBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.5rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isFavorite ? '#ef4444' : 'rgba(255, 255, 255, 0.8)'};
  color: ${props => props.isFavorite ? 'white' : '#6b7280'};

  &:hover {
    background: ${props => props.isFavorite ? '#ef4444' : 'white'};
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const VideoTitle = styled.h3`
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  font-family: "Gowun Dodum", cursive;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const VideoDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 0.75rem 0;
  font-family: "Quicksand", cursive;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`;

const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
`;

const InstructorName = styled.span`
  font-family: "Quicksand", cursive;
`;

const ViewsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const BadgesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BadgeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DifficultyBadge = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  color: white;
  background-color: ${props => props.color};
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RatingText = styled.span`
  font-size: 0.75rem;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 2rem;
  overflow: hidden;
  max-width: 4rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;

  ${props => props.isFullscreen && `
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
  `}

  @media (min-width: 1024px) {
    max-width: 64rem;
  }
`;

const VideoContainer = styled.div`
  position: relative;
`;

const VideoIframe = styled.iframe`
  width: 100%;
  height: ${props => props.isFullscreen ? '100vh' : '16rem'};

  @media (min-width: 768px) {
    height: ${props => props.isFullscreen ? '100vh' : '24rem'};
  }
`;

const VideoControls = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const VideoInfo = styled.div`
  padding: 1.5rem;
`;

const VideoInfoHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const VideoInfoContent = styled.div`
  flex: 1;
`;

const VideoInfoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  font-family: "Playwrite DE SAS", cursive;
`;

const VideoInfoInstructor = styled.p`
  color: #6b7280;
  margin: 0;
  font-family: "Gowun Dodum", cursive;
`;

const VideoInfoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const VideoInfoMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const VideoInfoDescription = styled.p`
  color: #374151;
  line-height: 1.6;
  font-family: "Gowun Dodum", cursive;
  margin: 0;
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 3rem 0;
`;

const EmptyStateEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  font-family: "Playwrite DE SAS", cursive;
`;

const EmptyStateText = styled.p`
  color: #9ca3af;
  margin: 0;
  font-family: "Gowun Dodum", cursive;
`;

const MeditationVideosPage = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favoriteVideos, setFavoriteVideos] = useState(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);

  // Sample meditation videos data
  const meditationVideos = [
    {
      id: 1,
      title: "10-Minute Morning Meditation",
      duration: "10:00",
      instructor: "Sarah Johnson",
      category: "morning",
      difficulty: "Beginner",
      views: "125K",
      rating: 4.8,
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      description: "Start your day with mindfulness and positive energy. This gentle morning meditation helps center your thoughts.",
      videoUrl: "https://www.youtube.com/embed/inpok4MKVLM"
    },
    {
      id: 2,
      title: "Deep Breathing for Anxiety Relief",
      duration: "15:30",
      instructor: "Dr. Michael Chen",
      category: "anxiety",
      difficulty: "Beginner",
      views: "87K",
      rating: 4.9,
      thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop",
      description: "Learn powerful breathing techniques to manage anxiety and stress. Perfect for moments when you need quick relief.",
      videoUrl: "https://www.youtube.com/embed/YRPh_GaiL8s"
    },
    {
      id: 3,
      title: "Body Scan Meditation",
      duration: "20:45",
      instructor: "Emma Thompson",
      category: "sleep",
      difficulty: "Intermediate",
      views: "203K",
      rating: 4.7,
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      description: "Progressive body scan meditation to release tension and prepare for restful sleep.",
      videoUrl: "https://www.youtube.com/embed/15q17jbIpVw"
    },
    {
      id: 4,
      title: "Mindful Walking Meditation",
      duration: "12:20",
      instructor: "James Wilson",
      category: "mindfulness",
      difficulty: "Beginner",
      views: "156K",
      rating: 4.6,
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop",
      description: "Transform your daily walk into a mindful practice. Connect with nature and your inner self.",
      videoUrl: "https://www.youtube.com/embed/vmx0EZSbrm0"
    },
    {
      id: 5,
      title: "Loving-Kindness Meditation",
      duration: "18:15",
      instructor: "Dr. Lisa Park",
      category: "emotional",
      difficulty: "Intermediate",
      views: "94K",
      rating: 4.8,
      thumbnail: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=300&fit=crop",
      description: "Cultivate compassion and love for yourself and others through this heart-opening practice.",
      videoUrl: "https://www.youtube.com/embed/sz7cpV7ERsM"
    },
    {
      id: 6,
      title: "Advanced Concentration Practice",
      duration: "25:00",
      instructor: "Robert Kumar",
      category: "focus",
      difficulty: "Advanced",
      views: "67K",
      rating: 4.9,
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      description: "Deepen your concentration with advanced meditation techniques for experienced practitioners.",
      videoUrl: "https://www.youtube.com/embed/AxuKNlCZFTw"
    }
  ];

  const categories = [
    { id: "all", name: "All Videos" },
    { id: "morning", name: "Morning" },
    { id: "anxiety", name: "Anxiety Relief" },
    { id: "sleep", name: "Sleep" },
    { id: "mindfulness", name: "Mindfulness" },
    { id: "emotional", name: "Emotional" },
    { id: "focus", name: "Focus" }
  ];

  const filteredVideos = meditationVideos.filter(video => {
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    return matchesCategory;
  });

  const toggleFavorite = (videoId) => {
    const newFavorites = new Set(favoriteVideos);
    if (newFavorites.has(videoId)) {
      newFavorites.delete(videoId);
    } else {
      newFavorites.add(videoId);
    }
    setFavoriteVideos(newFavorites);
  };

  const openVideoModal = (video) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setIsFullscreen(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "#48BB78";
      case "Intermediate": return "#ED8936";
      case "Advanced": return "#E53E3E";
      default: return "#597c49ff";
    }
  };

  return (
    <Container>
      {/* Header */}
      <Header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <HeaderContent>
          <Title>Mind Ease</Title>
          <Subtitle>Guided Meditation Videos</Subtitle>
        </HeaderContent>
        
        <HomeButton onClick={() => window.history.back()}>
          <Home size={18} />
          Home
        </HomeButton>
      </Header>

      {/* Search and Filter Bar */}
      <FilterContainer
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <FilterWrapper>
          {/* Category Filter */}
          <CategoryButtons>
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                active={selectedCategory === category.id}
              >
                {category.name}
              </CategoryButton>
            ))}
          </CategoryButtons>
        </FilterWrapper>
      </FilterContainer>

      {/* Videos Grid */}
      <VideosGrid
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {filteredVideos.map((video, index) => (
          <VideoCard
            key={video.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            onClick={() => openVideoModal(video)}
          >
            {/* Thumbnail */}
            <ThumbnailContainer>
              <ThumbnailImage src={video.thumbnail} alt={video.title} />
              <ThumbnailOverlay>
                <PlayIconContainer>
                  <Play color="#374151" size={24} />
                </PlayIconContainer>
              </ThumbnailOverlay>
              
              {/* Duration Badge */}
              <DurationBadge>
                <Clock size={12} />
                {video.duration}
              </DurationBadge>

              {/* Favorite Button */}
              <FavoriteButton
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(video.id);
                }}
                isFavorite={favoriteVideos.has(video.id)}
              >
                <Heart size={16} fill={favoriteVideos.has(video.id) ? "currentColor" : "none"} />
              </FavoriteButton>
            </ThumbnailContainer>

            {/* Content */}
            <CardContent>
              <VideoTitle>{video.title}</VideoTitle>
              <VideoDescription>{video.description}</VideoDescription>

              <VideoMeta>
                <InstructorName>by {video.instructor}</InstructorName>
                <ViewsContainer>
                  <Users size={12} />
                  {video.views}
                </ViewsContainer>
              </VideoMeta>

              <BadgesContainer>
                <BadgeGroup>
                  <DifficultyBadge color={getDifficultyColor(video.difficulty)}>
                    {video.difficulty}
                  </DifficultyBadge>
                  <RatingContainer>
                    <Star size={12} color="#eab308" fill="#eab308" />
                    <RatingText>{video.rating}</RatingText>
                  </RatingContainer>
                </BadgeGroup>
              </BadgesContainer>
            </CardContent>
          </VideoCard>
        ))}
      </VideosGrid>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVideoModal}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              isFullscreen={isFullscreen}
            >
              {/* Video Player */}
              <VideoContainer>
                <VideoIframe
                  ref={videoRef}
                  src={selectedVideo.videoUrl}
                  frameBorder="0"
                  allowFullScreen
                  title={selectedVideo.title}
                  isFullscreen={isFullscreen}
                />
                
                {/* Controls */}
                <VideoControls>
                  <ControlButton onClick={() => setIsFullscreen(!isFullscreen)}>
                    <Maximize size={16} />
                  </ControlButton>
                  <ControlButton onClick={closeVideoModal}>
                    <X size={16} />
                  </ControlButton>
                </VideoControls>
              </VideoContainer>

              {/* Video Info */}
              {!isFullscreen && (
                <VideoInfo>
                  <VideoInfoHeader>
                    <VideoInfoContent>
                      <VideoInfoTitle>{selectedVideo.title}</VideoInfoTitle>
                      <VideoInfoInstructor>by {selectedVideo.instructor}</VideoInfoInstructor>
                    </VideoInfoContent>
                    
                    <FavoriteButton
                      onClick={() => toggleFavorite(selectedVideo.id)}
                      isFavorite={favoriteVideos.has(selectedVideo.id)}
                    >
                      <Heart size={20} fill={favoriteVideos.has(selectedVideo.id) ? "currentColor" : "none"} />
                    </FavoriteButton>
                  </VideoInfoHeader>

                  <VideoInfoMeta>
                    <VideoInfoMetaItem>
                      <Clock size={16} />
                      {selectedVideo.duration}
                    </VideoInfoMetaItem>
                    <VideoInfoMetaItem>
                      <Users size={16} />
                      {selectedVideo.views} views
                    </VideoInfoMetaItem>
                    <VideoInfoMetaItem>
                      <Star size={16} color="#eab308" fill="#eab308" />
                      {selectedVideo.rating}
                    </VideoInfoMetaItem>
                    <DifficultyBadge color={getDifficultyColor(selectedVideo.difficulty)}>
                      {selectedVideo.difficulty}
                    </DifficultyBadge>
                  </VideoInfoMeta>

                  <VideoInfoDescription>{selectedVideo.description}</VideoInfoDescription>
                </VideoInfo>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <EmptyState
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <EmptyStateEmoji>🧘‍♀️</EmptyStateEmoji>
          <EmptyStateTitle>No videos found</EmptyStateTitle>
          <EmptyStateText>Try adjusting your search or filter criteria</EmptyStateText>
        </EmptyState>
      )}
    </Container>
  );
};

export default MeditationVideosPage;