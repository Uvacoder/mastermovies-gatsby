export interface IGlacierSummary {
  id: number;
  name: string;
  release: string;
}

export interface IGlacier {
  id: number;
  name: string;
  release: string;
  public: boolean;

  description: string | null;
  location: string | null;
  copyright: string | null;
  crew: { [index: string]: string } | null;
  views: number | null;
  runtime: number | null;

  exports: IGlacierExport[];
  thumbnails: IGlacierThumbnail[];
}

export interface IGlacierExport {
  id: number;
  filename: string;

  width: number;
  height: number;
  size: string; // it's type is casted from bigint
  mime: string;
  video_codec: string | null;
  audio_codec: string | null;
  checksum: { [index: string]: string } | null;
  bitrate: number;
}

export interface IGlacierThumbnail {
  id: number;
  width: number;
  height: number;
  mime: string;
}
