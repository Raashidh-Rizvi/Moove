package com.moove.DTO;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PropertyImageDTO {

    private String propertyImage;
    private String  propertyFileName;
    private String  propertyFileType;
    private long propertyFileSize;

    public PropertyImageDTO() {}

    public PropertyImageDTO(String propertyImage, String propertyFileName, String propertyFileType, long propertyFileSize) {
        this. propertyImage = propertyImage;
        this. propertyFileName = propertyFileName;
        this.propertyFileType = propertyFileType;
        this. propertyFileSize = propertyFileSize;
    }

}
