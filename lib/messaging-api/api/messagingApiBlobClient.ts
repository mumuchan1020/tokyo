/**
 * LINE Messaging API
 * This document describes LINE Messaging API.
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/* tslint:disable:no-unused-locals */
import { GetMessageContentTranscodingResponse } from "../model/getMessageContentTranscodingResponse.js";

import * as Types from "../../types.js";
import { ensureJSON } from "../../utils.js";
import { Readable } from "node:stream";

import HTTPFetchClient, {
  convertResponseToReadable,
} from "../../http-fetch.js";

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

interface httpClientConfig {
  baseURL?: string;
  channelAccessToken: string;
  // TODO support defaultHeaders?
}

export class MessagingApiBlobClient {
  private httpClient: HTTPFetchClient;

  constructor(config: httpClientConfig) {
    if (!config.baseURL) {
      config.baseURL = "https://api-data.line.me";
    }
    this.httpClient = new HTTPFetchClient({
      defaultHeaders: {
        Authorization: "Bearer " + config.channelAccessToken,
      },
      baseURL: config.baseURL,
    });
  }

  private async parseHTTPResponse(response: Response) {
    const { LINE_REQUEST_ID_HTTP_HEADER_NAME } = Types;
    let resBody: Record<string, any> = {
      ...(await response.json()),
    };
    if (response.headers.get(LINE_REQUEST_ID_HTTP_HEADER_NAME)) {
      resBody[LINE_REQUEST_ID_HTTP_HEADER_NAME] = response.headers.get(
        LINE_REQUEST_ID_HTTP_HEADER_NAME,
      );
    }
    return resBody;
  }

  /**
   * Download image, video, and audio data sent from users.
   * @param messageId Message ID of video or audio
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-content"> Documentation</a>
   */
  public async getMessageContent(messageId: string): Promise<Readable> {
    return (await this.getMessageContentWithHttpInfo(messageId)).body;
  }

  /**
   * Download image, video, and audio data sent from users..
   * This method includes HttpInfo object to return additional information.
   * @param messageId Message ID of video or audio
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-content"> Documentation</a>
   */
  public async getMessageContentWithHttpInfo(
    messageId: string,
  ): Promise<Types.ApiResponseType<Readable>> {
    const response = await this.httpClient.get(
      "/v2/bot/message/{messageId}/content".replace(
        "{" + "messageId" + "}",
        String(messageId),
      ),
    );
    return {
      httpResponse: response,
      body: convertResponseToReadable(response),
    };
  }
  /**
   * Get a preview image of the image or video
   * @param messageId Message ID of image or video
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-image-or-video-preview"> Documentation</a>
   */
  public async getMessageContentPreview(messageId: string): Promise<Readable> {
    return (await this.getMessageContentPreviewWithHttpInfo(messageId)).body;
  }

  /**
   * Get a preview image of the image or video.
   * This method includes HttpInfo object to return additional information.
   * @param messageId Message ID of image or video
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-image-or-video-preview"> Documentation</a>
   */
  public async getMessageContentPreviewWithHttpInfo(
    messageId: string,
  ): Promise<Types.ApiResponseType<Readable>> {
    const response = await this.httpClient.get(
      "/v2/bot/message/{messageId}/content/preview".replace(
        "{" + "messageId" + "}",
        String(messageId),
      ),
    );
    return {
      httpResponse: response,
      body: convertResponseToReadable(response),
    };
  }
  /**
   * Verify the preparation status of a video or audio for getting
   * @param messageId Message ID of video or audio
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#verify-video-or-audio-preparation-status"> Documentation</a>
   */
  public async getMessageContentTranscodingByMessageId(
    messageId: string,
  ): Promise<GetMessageContentTranscodingResponse> {
    return (
      await this.getMessageContentTranscodingByMessageIdWithHttpInfo(messageId)
    ).body;
  }

  /**
   * Verify the preparation status of a video or audio for getting.
   * This method includes HttpInfo object to return additional information.
   * @param messageId Message ID of video or audio
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#verify-video-or-audio-preparation-status"> Documentation</a>
   */
  public async getMessageContentTranscodingByMessageIdWithHttpInfo(
    messageId: string,
  ): Promise<Types.ApiResponseType<GetMessageContentTranscodingResponse>> {
    const res = await this.httpClient.get(
      "/v2/bot/message/{messageId}/content/transcoding".replace(
        "{messageId}",
        String(messageId),
      ),
    );
    return { httpResponse: res, body: await res.json() };
  }
  /**
   * Download rich menu image.
   * @param richMenuId ID of the rich menu with the image to be downloaded
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#download-rich-menu-image"> Documentation</a>
   */
  public async getRichMenuImage(richMenuId: string): Promise<Readable> {
    return (await this.getRichMenuImageWithHttpInfo(richMenuId)).body;
  }

  /**
   * Download rich menu image..
   * This method includes HttpInfo object to return additional information.
   * @param richMenuId ID of the rich menu with the image to be downloaded
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#download-rich-menu-image"> Documentation</a>
   */
  public async getRichMenuImageWithHttpInfo(
    richMenuId: string,
  ): Promise<Types.ApiResponseType<Readable>> {
    const response = await this.httpClient.get(
      "/v2/bot/richmenu/{richMenuId}/content".replace(
        "{" + "richMenuId" + "}",
        String(richMenuId),
      ),
    );
    return {
      httpResponse: response,
      body: convertResponseToReadable(response),
    };
  }
  /**
   * Upload rich menu image
   * @param richMenuId The ID of the rich menu to attach the image to
   * @param body
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#upload-rich-menu-image"> Documentation</a>
   */
  public async setRichMenuImage(
    richMenuId: string,
    body?: Blob,
  ): Promise<Types.MessageAPIResponseBase> {
    return (await this.setRichMenuImageWithHttpInfo(richMenuId, body)).body;
  }

  /**
   * Upload rich menu image.
   * This method includes HttpInfo object to return additional information.
   * @param richMenuId The ID of the rich menu to attach the image to
   * @param body
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#upload-rich-menu-image"> Documentation</a>
   */
  public async setRichMenuImageWithHttpInfo(
    richMenuId: string,
    body?: Blob,
  ): Promise<Types.ApiResponseType<Types.MessageAPIResponseBase>> {
    const params = body;

    const res = await this.httpClient.postBinaryContent(
      "/v2/bot/richmenu/{richMenuId}/content".replace(
        "{richMenuId}",
        String(richMenuId),
      ),
      params,
    );
    return { httpResponse: res, body: await res.json() };
  }
}
