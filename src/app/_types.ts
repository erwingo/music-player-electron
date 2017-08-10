export interface Song {
  id: string;
  artistId: string;
  albumId?: string;
  name: string;
  path: string;
  covers: string[];
  albumCovers: string[];
  artistCovers: string[];
  fileExtension: string;
  createdAt: string;
  updatedAt: string;
}

export interface Artist {
  id: string;
  name: string;
  path: string;
  covers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  id: string;
  artistId: string;
  path: string;
  name: string;
  covers: string[];
  createdAt: string;
  updatedAt: string;
}
