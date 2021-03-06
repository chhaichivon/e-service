package org.code.jarvis.model.core;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;

/**
 * Created by ki.kao on 8/28/2017.
 */
@Entity
@Table(name = "td_advertisement")
public class Advertisement extends AbstractEntity {

    @JsonIgnore
    private Image image;
    @JsonProperty("IMAGE")
    private Long imageId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "adv_id")
    @JsonProperty("ID")
    @Override
    public Long getId() {
        return id;
    }

    @Column(name = "adv_code")
    @JsonIgnore
    @Override
    public String getCode() {
        return code;
    }

    @Column(name = "adv_desc")
    @JsonIgnore
    @Override
    public String getDesc() {
        return desc;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "img_id", referencedColumnName = "img_id", nullable = false)
    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }

    @Transient
    public Long getImageId() {
        if (image != null) {
            imageId = image.getId();
        }
        return imageId;
    }

    public void setImageId(Image image) {
        this.imageId = image.getId();
    }
}
