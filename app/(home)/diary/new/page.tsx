'use client';

import {ChangeEvent, useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import { useSearchParams, ReadonlyURLSearchParams, useRouter } from 'next/navigation';
import api from '@/app/api/api';

// 이미지 썸네일 컴포넌트
interface ImageThumbnailProps {
  src: string;
  index: number;
  isSelected: boolean;
  onClick: (index: number) => void;
  onRemove: (e: React.MouseEvent, index: number) => void;
}

const ImageThumbnail = ({ src, index, isSelected, onClick, onRemove }: ImageThumbnailProps) => (
  <div 
    className={`border ${isSelected ? 'border-red-500 border-4' : 'border-amber-200'} rounded-md overflow-hidden relative cursor-pointer`}
    onClick={(e) => onClick(index)}
  >
    <div className="w-full aspect-square relative">
      <Image
        src={src}
        alt={`이미지 ${index + 1}`}
        fill
        className="object-cover"
      />
    </div>
    <button
      className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-bl-md z-10"
      onClick={(e) => onRemove(e, index)}
    >
      X
    </button>
  </div>
);

// 이미지 업로드 버튼 컴포넌트
interface UploadButtonProps {
  onClick: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  multiple: boolean;
}

const UploadButton = ({ onClick, inputRef, onChange, multiple }: UploadButtonProps) => (
  <div 
    onClick={onClick}
    className="border border-dashed border-amber-300 bg-amber-50 rounded-md flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-amber-100"
  >
    <span className="text-2xl text-amber-300">+</span>
    <span className="text-xs text-amber-500">Upload</span>
    <input 
      type="file" 
      ref={inputRef}
      onChange={onChange}
      accept="image/*"
      className="hidden"
      multiple={multiple}
    />
  </div>
);

// 일기 작성 폼 컴포넌트 (Step 1)
interface DiaryFormProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  visibility: string;
  setVisibility: (visibility: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const DiaryForm = ({ 
  title, setTitle, content, setContent, visibility, setVisibility, isLoading, onSubmit
}: DiaryFormProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <input
          type="text"
          placeholder="제목 입력"
          className="w-full p-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-4">
        <textarea
          placeholder="글을 작성해주세요..."
          className="w-full h-60 p-2 border border-amber-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-6">
        <p className="mb-2">일기 공개 여부</p>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={visibility === 'public'}
              onChange={() => setVisibility('public')}
              className="mr-2"
            />
            <span>전체공개</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="visibility"
              value="friends"
              checked={visibility === 'friends'}
              onChange={() => setVisibility('friends')}
              className="mr-2"
            />
            <span>친구공개</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={visibility === 'private'}
              onChange={() => setVisibility('private')}
              className="mr-2"
            />
            <span>비공개</span>
          </label>
        </div>
      </div>
      
      <div className="text-center">
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md transition-colors"
          disabled={isLoading}
        >
          {isLoading ? '작성하기...' : '작성하기'}
        </button>
      </div>
    </form>
  );
};

// 이미지 생성 및 선택 컴포넌트 (Step 2)
interface ImageGeneratorProps {
  isGeneratingImage: boolean;
  images: string[];
  uploadPreviews: string[];
  selectedImageIndex: number;
  handleImageClick: (index: number) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveUploadedPreview: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  triggerFileInput: () => void;
  handleRegisterImage: () => void;
  handleSaveDiary: () => void;
  handleRegenerateImage: () => void;
  allImages: string[];
}

const ImageGenerator = ({
  isGeneratingImage, images, uploadPreviews, selectedImageIndex, handleImageClick,
  handleRemoveImage, handleRemoveUploadedPreview, fileInputRef, handleFileUpload,
  triggerFileInput, handleRegisterImage, handleSaveDiary, handleRegenerateImage, allImages
}: ImageGeneratorProps) => (
  <div className="p-6">
    <div className="text-center mb-6">
      <h2 className="text-xl font-semibold mb-2">
        {isGeneratingImage 
          ? '이미지 생성 중...' 
          : '작성하신 일기를 바탕으로 다음 이미지가 생성되었습니다'}
      </h2>
      {!isGeneratingImage && allImages.length > 0 && (
        <p className="text-gray-600 text-sm">총 3개의 이미지를 등록할 수 있으며, 이미지를 클릭하면 대표이미지로 설정됩니다.</p>
      )}
    </div>
    
    {/* 큰 미리보기 영역 */}
    <div className="w-full aspect-square max-w-md mx-auto relative mb-6 bg-white rounded-md">
      {isGeneratingImage ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-gray-600 mb-4">
            작성하신 일기를 바탕으로<br />
            오늘의 이미지를 생성중입니다.
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        allImages.length > 0 && (
          <Image
            src={allImages[selectedImageIndex]}
            alt="생성된 이미지"
            fill
            className="object-contain rounded-md"
          />
        )
      )}
    </div>
    
    <div className="mt-8">
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
        {!isGeneratingImage && images.map((src, index) => (
          <ImageThumbnail
            key={`server-${index}`}
            src={src}
            index={index}
            isSelected={selectedImageIndex === index}
            onClick={handleImageClick}
            onRemove={(e, i) => {
              e.stopPropagation();
              handleRemoveImage(i);
            }}
          />
        ))}
        
        {uploadPreviews.map((preview, index) => (
          <ImageThumbnail
            key={`upload-preview-${index}`}
            src={preview}
            index={images.length + index}
            isSelected={selectedImageIndex === images.length + index}
            onClick={handleImageClick}
            onRemove={(e, i) => {
              e.stopPropagation();
              handleRemoveUploadedPreview(i - images.length);
            }}
          />
        ))}
        
        {/* 파일 업로드 버튼 */}
        {!isGeneratingImage && allImages.length < 3 && (
          <UploadButton
            onClick={triggerFileInput}
            inputRef={fileInputRef}
            onChange={handleFileUpload}
            multiple={allImages.length < 2}
          />
        )}
      </div>
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleRegenerateImage}
          className="bg-amber-200 hover:bg-amber-300 text-amber-800 px-6 py-2 rounded-md transition-colors"
          disabled={isGeneratingImage}
        >
          이미지 재선정
        </button>
        
        <button
          onClick={handleSaveDiary}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md transition-colors"
          disabled={isGeneratingImage || allImages.length === 0}
        >
          이미지 등록하기
        </button>
      </div>
    </div>
  </div>
);

// 날짜 및 페이지 제목 결정 로직 함수
const determineDateAndTitle = (searchParams: ReadonlyURLSearchParams): { determinedDate: string; newPageTitle: string } => {
  const dateParam = searchParams.get('date');
  
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const todayDay = today.getDate().toString().padStart(2, '0');
  const todayDateStr = `${todayYear}-${todayMonth}-${todayDay}`;

  let determinedDate = todayDateStr;
  if (dateParam) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      determinedDate = dateParam;
    }
  }

  let newPageTitle = '오늘의 일기';
  if (determinedDate === todayDateStr) {
    newPageTitle = '오늘의 일기';
  } else {
    const dDate = new Date(determinedDate);
    const tDate = new Date(todayDateStr);
    dDate.setHours(0, 0, 0, 0);
    tDate.setHours(0, 0, 0, 0);

    if (dDate < tDate) {
      newPageTitle = '지난 일기';
    } else {
      newPageTitle = '오늘의 일기';
    }
  }
  return { determinedDate, newPageTitle };
};

// 메인 페이지 컴포넌트
export default function DiaryNewPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState('');
  const [pageTitle, setPageTitle] = useState('오늘의 일기');

  useEffect(() => {
    const { determinedDate, newPageTitle } = determineDateAndTitle(searchParams); 
   
    setCurrentDate(determinedDate);
    setPageTitle(newPageTitle);
  }, [searchParams]);

  // 모든 이미지 (서버 이미지 + 업로드된 이미지)
  const allImages = [...images, ...uploadPreviews];

  const handleSubmitForm = async (e: React.FormEvent) => {
    console.log(title);
    e.preventDefault();
    setIsLoading(true);
    setStep(2);
    setIsGeneratingImage(true);
    
    try {
      // 실제 구현에서는 여기서 API로 데이터를 전송합니다
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 서버로부터 이미지를 받았다고 가정합니다 (한 장만 받음)
      const mockImages = [
        '/images/cat-king.png',
      ];
      
      setImages(mockImages);
      setIsGeneratingImage(false);
    } catch (error) {
      console.error('일기 저장 중 오류 발생:', error);
      setIsGeneratingImage(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateImage = async () => {
    setIsGeneratingImage(true);
    
    try {
      // 기존 이미지 초기화 (사용자가 업로드한 이미지도 초기화할지 여부는 요구사항에 따라 달라질 수 있음)
      setImages([]);
      setSelectedImageIndex(0);
      
      // 새 이미지 생성 요청
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 서버로부터 새로운 이미지를 받았다고 가정
      const newMockImages = [
        '/images/cat-king.png',
      ];
      
      setImages(newMockImages);
    } catch (error) {
      console.error('이미지 재생성 중 오류 발생:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleRegisterImage = () => {
    // Step 3로 이동하지 않고 바로 저장합니다.
    handleSaveDiary();
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    if (selectedImageIndex >= newImages.length && newImages.length > 0) {
      setSelectedImageIndex(newImages.length - 1);
    } else if (selectedImageIndex === index && newImages.length > 0) {
      setSelectedImageIndex(0);
    }
  };

  const handleRemoveUploadedPreview = (index: number) => {
    const newPreviews = [...uploadPreviews];
    const newFiles = [...uploadedFiles];
    const actualIndex = images.length + index;
    
    newPreviews.splice(index, 1);
    newFiles.splice(index, 1);
    
    setUploadPreviews(newPreviews);
    setUploadedFiles(newFiles);
    
    if (selectedImageIndex === actualIndex) {
      setSelectedImageIndex(0);
    } else if (selectedImageIndex > actualIndex) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleSaveDiary = async () => { 
     console.log(uploadedFiles); 

     const formData = new FormData();
     formData.append('title', title);
     formData.append('content', content);
     formData.append('visibility', visibility);
     uploadedFiles.forEach((file) => {
       formData.append('images', file);
     });
    
    const result = await api.post('/diary', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // 실제 구현에서는 여기서 최종 저장 API를 호출합니다
    alert('일기가 저장되었습니다!');
    console.log("result: ", result);
    if (result && result.data) {
      router.push(`/diary/${result.data}`);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
   
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const filesToAdd = selectedFiles.slice(0, 3 - (images.length + uploadedFiles.length));
      
      if (filesToAdd.length > 0) {
        const newFiles = [...uploadedFiles, ...filesToAdd];
        setUploadedFiles(newFiles);
        
        const filePreviewPromises = filesToAdd.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          });
        });
        
        Promise.all(filePreviewPromises).then(newPreviews => {
          setUploadPreviews([...uploadPreviews, ...newPreviews]);
        });
      }
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <main className="container mx-auto py-8 px-4 max-w-4xl bg-[#FEF4E4] rounded-lg p-6 shadow-md mt-10">
      <h1 className="text-2xl font-bold text-center mb-8">{pageTitle}</h1>
      {currentDate && (
        <div className="text-center mb-4 text-xl">{currentDate}</div>
      )}
      
      {step === 1 && (
        <DiaryForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          visibility={visibility}
          setVisibility={setVisibility}
          isLoading={isLoading}
          onSubmit={handleSubmitForm}
        />
      )}
      
      {step === 2 && (
        <ImageGenerator
          isGeneratingImage={isGeneratingImage}
          images={images}
          uploadPreviews={uploadPreviews}
          selectedImageIndex={selectedImageIndex}
          handleImageClick={handleImageClick}
          handleRemoveImage={handleRemoveImage}
          handleRemoveUploadedPreview={handleRemoveUploadedPreview}
          fileInputRef={fileInputRef}
          handleFileUpload={handleFileUpload}
          triggerFileInput={triggerFileInput}
          handleRegisterImage={handleRegisterImage}
          handleSaveDiary={handleSaveDiary}
          handleRegenerateImage={handleRegenerateImage}
          allImages={allImages}
        />
      )}
    </main>
  );
} 